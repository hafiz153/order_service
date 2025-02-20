import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdatePermissionDto, UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { PaginatedResponseDto, PaginationFilterDto } from 'src/common/dto/paginate.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto):Promise<Role> {
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  async findAll(@Body() body:PaginationFilterDto):Promise<PaginatedResponseDto<Role>> {
    return await this.roleService.findAll(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<Role>  {
    return await this.roleService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto):Promise<Role|null>  {
    return await this.roleService.update(id, updateRoleDto);
  }
  @Patch('add-permission/:id')
  async addPermissions(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto):Promise<Role|null>  {
    return await this.roleService.addPermissions(id, updatePermissionDto);
  }
  @Patch('remove-permissions/:id')
  async removePermissions(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto):Promise<Role|null>  {
    return await this.roleService.removePermissions(id, updatePermissionDto);
  }
  /**
   * Endpoint to initialize roles with permissions
   * @param authData Array of roles with permissions
   */
  @Post('initialize')
  async initializeRoles(): Promise<string> {
    await this.roleService.initializeRoles();
    return 'Roles and permissions initialized successfully!';
  }

  @Delete(':id')
  async remove(@Param('id') id: string):Promise<string> {
    return this.roleService.remove(id);
  }
}
