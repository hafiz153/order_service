import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: RegisterUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }
  async findAll(): Promise<any> {
    return await this.userModel.find();
  }
  async findOne(id: string): Promise<any> {
    return await this.userModel.findById(id);
  }
  async userPermissions(id: string): Promise<string[]> {
    const user = await this.userModel.findById(id).populate('roles').exec();

    if (!user || !user.roles) {
      throw new Error('User or roles not found');
    }

    // Extract unique permissions from all roles
    const uniquePermissions = [
      ...new Set(user.roles.flatMap((role: any) => role.permissions)),
    ];

    return uniquePermissions;
  }
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  async isUserExistsByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate({ id, updateUserDto });
  }
  async addRoles(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(
      id, // Filter by the role's ID
      { $push: { roles: { $each: updateUserRoleDto.roles } } }, // Push new permissions into the array
      { new: true }, // Return the updated document
    );
  }
  async removeRoles(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User | null> {
    return await this.userModel.findByIdAndUpdate(
      id, // Filter by the role's ID
      { $pull: { roles: { $in: updateUserRoleDto.roles } } }, // Remove permissions from the array
      { new: true }, // Return the updated document
    );
  }
  async remove(id: string): Promise<string> {
    const role = await this.userModel.findByIdAndDelete(id);
    if (role) return 'User deleted successfully';
    return 'User did not delete';
  }
}
