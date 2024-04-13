import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterDto extends CreateUserDto {}

export class LoginDto {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;
}
