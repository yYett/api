import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from 'src/types';

export class CreateUserDto {
  readonly _id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  // confirmationPassword

  @ApiProperty()
  readonly role: UserRoles;
}
