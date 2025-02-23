import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto, UpdateUserRoleDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/common/repository/base.repository';
import { PaginationFilterDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class UsersService {
  private readonly repo: BaseRepository<User>;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {
    this.repo = new BaseRepository<User>(userModel);
  }
  async create(createUserDto: RegisterUserDto): Promise<any> {
    return await this.repo.create(createUserDto);
  }
  async findAll(body:PaginationFilterDto): Promise<any> {

   return await this.repo.paginate(body,{password:0,refreshToken:0});
  }
  async findOne(id: string): Promise<any> {
    return await this.repo.findOne({ _id: id },{password:0,refreshToken:0});
  }
  async userPermissions(id: string): Promise<string[]> {
    const user = await this.repo.findOne({ _id: id },{roles:1},['roles']);
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
    const user = await this.repo.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
  async isUserExistsByEmail(email: string): Promise<User | null> {
    return await this.repo.isExists({ email });
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOneAndUpdate({_id:id}, updateUserDto );
    return user
  }
  async addRoles(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User | null> {
    return await this.repo.findOneAndUpdate(
      {_id:id}, // Filter by the role's ID
      { $push: { roles: { $each: updateUserRoleDto.roles } } }, // Push new permissions into the array
      { new: true }, // Return the updated document
    );
  }
  async removeRoles(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ): Promise<User | null> {
    return await this.repo.findOneAndUpdate(
      {_id:id}, // Filter by the role's ID
      { $pull: { roles: { $in: updateUserRoleDto.roles } } }, // Remove permissions from the array
      { new: true }, // Return the updated document
    );
  }
  async remove(id: string): Promise<string> {
    const role = await this.repo.remove({_id:id});
    if (role) return 'User deleted successfully';
    return 'User did not delete';
  }
}
