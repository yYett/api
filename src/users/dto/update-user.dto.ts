import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  readonly name: string;

  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;

  @ApiProperty()
  refreshToken?: string;
}
