import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  login: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: [String] })
  roles: string[];

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}