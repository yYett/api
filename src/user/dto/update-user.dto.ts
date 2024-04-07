import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/types';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  readonly username: string;

  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;

  @ApiProperty({ required: true })
  readonly role: UserRoles;
}
