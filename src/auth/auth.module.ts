import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: '120s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
