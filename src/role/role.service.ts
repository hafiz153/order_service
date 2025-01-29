import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdatePermissionDto, UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import rolePermissions from './data/role-permissions';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const isRoleExists = await this.isRoleExists(createRoleDto?.name);
    if (isRoleExists) throw new HttpException('Role already exists', 400);
    return await this.roleModel.create(createRoleDto);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleModel.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id);
    if (!role) throw new HttpException('Role Not Found.', 400);
    return role;
  }
  async isRoleExists(role: string): Promise<Role | null> {
    return await this.roleModel.findOne({ name: role });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    return await this.roleModel.findByIdAndUpdate({ id, updateRoleDto });
  }
  async addPermissions(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Role | null> {
    return await this.roleModel.findByIdAndUpdate(
      id, // Filter by the role's ID
      { $push: { permissions: { $each: updatePermissionDto.permissions } } }, // Push new permissions into the array
      { new: true }, // Return the updated document
    );
  }
  async removePermissions(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Role | null> {
    return await this.roleModel.findByIdAndUpdate(
      id, // Filter by the role's ID
      { $pull: { permissions: { $in: updatePermissionDto.permissions } } }, // Remove permissions from the array
      { new: true }, // Return the updated document
    );
  }

  async createOrUpdateRole(name: string, permissions: string[]): Promise<Role> {
    // Find the role by name
    const role = await this.roleModel.findOne({ name }).lean();

    if (role) {
      // If the role exists, update the permissions array
      const updatedRole = await this.roleModel
        .findByIdAndUpdate(
          role._id,
          { $addToSet: { permissions: { $each: permissions } } }, // Add only unique permissions
          { new: true }, // Return the updated role
        )
        .exec();
      return updatedRole!;
    } else {
      // If the role does not exist, create a new role
      const newRole = new this.roleModel({ name, permissions });
      return await newRole.save();
    }
  }

  async initializeRoles(): Promise<void> {
    const authData = rolePermissions;
    console.log({ authData });
    for (const { name, permissions } of authData) {
      console.log({ name, permissions });
      await this.createOrUpdateRole(name, permissions);
    }
  }
  async remove(id: string): Promise<string> {
    const role = await this.roleModel.findByIdAndDelete(id);
    if (role) return 'Role deleted successfully';
    return 'Role did not delete';
  }
}
