import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { Permissions } from 'src/auth/decorators/permission.decorator';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@Controller('users')
// @UseGuards(PermissionsGuard) // Apply guard at the controller level
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.read') // Only users with the 'admin' role can access this route
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Get('permissions/:id')
  async userPermissions(@Param('id') id: string): Promise<any> {
    return await this.usersService.userPermissions(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Patch('add-roles/:id')
  async addRoles(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User | null> {
    return await this.usersService.addRoles(id, updateUserRoleDto);
  }
  @Patch('remove-roles/:id')
  async removeRoles(
    @Param('id') id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User | null> {
    return await this.usersService.removeRoles(id, updateUserRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string):Promise<string> {
    return await this.usersService.remove(id);
  }
}
