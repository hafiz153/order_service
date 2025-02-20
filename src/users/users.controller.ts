import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
import { PaginationFilterDto } from 'src/common/dto/paginate.dto';

@ApiBearerAuth()
@Controller('users')
// @UseGuards(PermissionsGuard) // Apply guard at the controller level
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('user.read') // Only users with the 'admin' role can access this route
  @Get()
  async findAll(@Query() query:PaginationFilterDto):Promise<any> {
    return  await this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<any> {
    return await this.usersService.findOne(id);
  }
  @Get('permissions/:id')
  async userPermissions(@Param('id') id: string): Promise<any> {
    return await this.usersService.userPermissions(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
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
