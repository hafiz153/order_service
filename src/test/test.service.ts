import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { Test } from './entities/test.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResponseDto, PaginationFilterDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class TestService {
  private readonly repo: BaseRepository<Test>;
  
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {
    this.repo = new BaseRepository<Test>(testModel);
  }

  async create(data: CreateTestDto):Promise<Test|null> {
    return await this.repo.create(data);
  }

  async update(id: string, data: UpdateTestDto):Promise<Test|null> {
    return await this.repo.findOneAndUpdate({ _id: id }, data);
  }

  async remove(id: string):Promise<Test|null> {
    return await this.repo.remove({ _id: id });
  }

  async findOne(id: string):Promise<Test|null> {
    return await this.repo.findOne({ _id: id });
  }

  async findAll(query:PaginationFilterDto): Promise<PaginatedResponseDto<Test>>  {
    return await this.repo.paginate(query);
  }
}
