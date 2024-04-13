import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { LoginDto, RegisterDto } from './dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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

    // tokens
    const { token, refreshToken } = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, refreshToken);

    return { token, refreshToken };
  }

  async logout(userId: string) {
    this.userService.update(userId, { refreshToken: undefined });
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

  async getTokens(id: string, email: string) {
    const payload = { sub: id, email };

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    ]);

    return { token, refreshToken };
  }
}
