import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdatePermissionDto, UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import rolePermissions from './data/role-permissions';
import { BaseRepository } from 'src/common/repository/base.repository';
import {
  PaginatedResponseDto,
  PaginationFilterDto,
} from 'src/common/dto/paginate.dto';
import { Permission } from './entities/permission.entity';
import { StatusEnum } from 'src/common/enums/status.enum';

@Injectable()
export class RoleService {
  private readonly repo: BaseRepository<Role>;
  private readonly permissionRepo: BaseRepository<Permission>;
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name) private readonly permissionModel: Model<Permission>,
  ) {
    this.repo = new BaseRepository<Role>(roleModel);
    this.permissionRepo = new BaseRepository<Permission>(permissionModel);
  }
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const isRoleExists = await this.isRoleExists(createRoleDto?.name);
    if (isRoleExists) throw new HttpException('Role already exists', 400);
    return await this.repo.create(createRoleDto);
  }

  async findAll(
    body: PaginationFilterDto,
  ): Promise<PaginatedResponseDto<Role>> {
    return await this.repo.paginate(body);
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.repo.findOne({ _id: id });
    if (!role) throw new HttpException('Role Not Found.', 400);
    return role;
  }
  async isRoleExists(role: string): Promise<Role | null> {
    return await this.repo.findOne({ name: role });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    return await this.repo.findOneAndUpdate({ _id: id }, updateRoleDto);
  }
  async addPermissions(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Role | null> {
    return await this.repo.findOneAndUpdate(
      { _id: id }, // Filter by the role's ID
      { $push: { permissions: { $each: updatePermissionDto.permissions } } }, // Push new permissions into the array
      { new: true }, // Return the updated document
    );
  }
  async removePermissions(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Role | null> {
    return await this.roleModel.findByIdAndUpdate(
      { _id: id }, // Filter by the role's ID
      { $pull: { permissions: { $in: updatePermissionDto.permissions } } }, // Remove permissions from the array
      { new: true }, // Return the updated document
    );
  }

  async initializeRoles(): Promise<void> {
    const authData = rolePermissions;
    for (const { name, permissions } of authData) {
      await this.createOrUpdateRole(name, permissions);
    }
  }

  async createOrUpdateRole(name: string, permissions: string[]): Promise<Role |null> {
    // Ensure all permissions exist before adding them to a role
    const uniquePermissions = await this.ensurePermissionsExist(permissions);

    // Find the role by name
    const role = await this.repo.isExists({ name });

    if (role) {
      // Update role permissions (add only unique ones)
      return await this.repo.findOneAndUpdate(
        { _id: role._id },
        { $addToSet: { permissions: { $each: uniquePermissions } } },
        { new: true },
      );
    } else {
      // Create a new role with permissions
      return await this.repo.create({ name, permissions: uniquePermissions });
    }
  }

  async ensurePermissionsExist(permissionNames: string[]): Promise<string[]> {
    const existingPermissions = await this.permissionRepo.find({
      name: { $in: permissionNames },
    });

    const existingPermissionNames = existingPermissions?.map(
      (perm) => perm.name,
    );

    const newPermissions = permissionNames
      .filter((perm) => !existingPermissionNames.includes(perm))
      .map((perm) => ({
        name: perm,
        description: `${perm} permission`,
        status: StatusEnum.ACTIVE,
      }));

    if (newPermissions.length > 0) {
      await this.permissionRepo.insertMany(newPermissions);
    }

    return [
      ...existingPermissionNames,
      ...newPermissions.map((perm) => perm.name),
    ];
  }

  async remove(id: string): Promise<string> {
    const role = await this.repo.remove({ _id: id });
    if (role) return 'Role deleted successfully';
    return 'Role did not delete';
  }
  //Permissions
  async findAllPermissions(): Promise<string[]> {
    const permissions = await this.permissionRepo.find({});
    const response = permissions.map(p=>p.name)
    return response
  }
}
