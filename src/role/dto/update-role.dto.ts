import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class UpdatePermissionDto{
    @ApiProperty({description:"array of permissions"})
    permissions:string[]
}
