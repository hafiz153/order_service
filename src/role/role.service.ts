import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdatePermissionDto, UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import rolePermissions from './data/role-permissions';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PaginatedResponseDto, PaginationFilterDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class RoleService {
  private readonly repo: BaseRepository<Role>;
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {
    this.repo = new BaseRepository<Role>(roleModel);
  }
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const isRoleExists = await this.isRoleExists(createRoleDto?.name);
    if (isRoleExists) throw new HttpException('Role already exists', 400);
    return await this.repo.create(createRoleDto);
  }

  async findAll(body:PaginationFilterDto): Promise<PaginatedResponseDto<Role>> {
    return await this.repo.paginate(body);
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.repo.findOne({_id:id});
    if (!role) throw new HttpException('Role Not Found.', 400);
    return role;
  }
  async isRoleExists(role: string): Promise<Role | null> {
    return await this.repo.findOne({ name: role });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    return await this.repo.findOneAndUpdate({ _id:id}, updateRoleDto );
  }
  async addPermissions(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Role | null> {
    return await this.repo.findOneAndUpdate(
      {_id:id}, // Filter by the role's ID
      { $push: { permissions: { $each: updatePermissionDto.permissions } } }, // Push new permissions into the array
      { new: true }, // Return the updated document
    );
  }
  async removePermissions(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Role | null> {
    return await this.roleModel.findByIdAndUpdate(
      {_id:id}, // Filter by the role's ID
      { $pull: { permissions: { $in: updatePermissionDto.permissions } } }, // Remove permissions from the array
      { new: true }, // Return the updated document
    );
  }

  async createOrUpdateRole(name: string, permissions: string[]): Promise<Role> {
    // Find the role by name
    const role = await this.repo.findOne({ name });

    if (role) {
      // If the role exists, update the permissions array
      
      const updatedRole = await this.repo
        .findOneAndUpdate(
          {_id:role._id},
          { $addToSet: { permissions: { $each: permissions } } }, // Add only unique permissions
          { new: true }, // Return the updated role
        )
      return updatedRole!;
    } else {
      // If the role does not exist, create a new role
      const newRole = await this.repo.create({ name, permissions });
      return newRole
    }
  }

  async initializeRoles(): Promise<void> {
    const authData = rolePermissions;
    for (const { name, permissions } of authData) {
      await this.createOrUpdateRole(name, permissions);
    }
  }
  async remove(id: string): Promise<string> {
    const role = await this.repo.remove({_id:id});
    if (role) return 'Role deleted successfully';
    return 'Role did not delete';
  }
}
