import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Public } from './decorators/public.decorator';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

type RequestUser = {
  user: {
    sub: string;
  };
  token: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('logout')
  logout(@Req() req: Request & RequestUser) {
    this.authService.logout(req.user.sub);
  }

  @ApiBearerAuth()
  @Get('refresh')
  refreshTokens(@Req() req: Request & RequestUser) {
    return this.authService.refreshTokens(req.user.sub, req.token);
  }
}
