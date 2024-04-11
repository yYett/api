import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private c: UserService,
  ) {}

  async login(email: string, pass: string): Promise<any> {
    const user = await this.usersService.find(email);

    if (user?.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user._id, user.email);

    await this.usersService.update(user._id, {
      refreshToken: tokens.refreshToken,
    });

    return { user, ...tokens };
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
