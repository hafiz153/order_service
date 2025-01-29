import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'array of permissions',
    example: '679335b68f4f19cacf6c45d1',
  })
  roles: string[];
}
