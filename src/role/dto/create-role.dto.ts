import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'The name of the role',
    example: 'Admin',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'A list of permissions associated with this role',
    example: ['READ_USER', 'WRITE_USER'],
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  readonly permissions: string[];
}
