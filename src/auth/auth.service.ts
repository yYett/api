import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { LoginDto, RegisterDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.find(registerDto.email);
    if (user) throw new BadRequestException('User already exists');

    const hash = await this.hashData(registerDto.password);

    const newUser = await this.userService.create({
      ...registerDto,
      password: hash,
    });

    return newUser;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.find(loginDto.email);
    if (!user) throw new BadRequestException('User does not exist');

    const matchPass = await argon2.verify(user.password, loginDto.password);
    if (!matchPass) throw new BadRequestException('Password is incorrect');

    return await this.getNewTokens(user.id, user.email);
  }

  async logout(userId: any) {
    this.userService.update(userId, { refreshToken: '' });
  }

  async refreshTokens(id: string, token: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new UnauthorizedException();

    const matchToken = await argon2.verify(user.refreshToken, token);
    if (!matchToken) throw new UnauthorizedException();

    return await this.getNewTokens(user.id, user.email);
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashToken = await this.hashData(refreshToken);
    await this.userService.update(id, {
      refreshToken: hashToken,
    });
  }

  async getNewTokens(id: string, email: string) {
    const { token, refreshToken } = await this.getTokens(id, email);
    await this.updateRefreshToken(id, refreshToken);

    return { token, refreshToken };
  }

  async getTokens(id: string, email: string) {
    const payload = { sub: id, email };

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwt.secretExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refresh'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { token, refreshToken };
  }
}
