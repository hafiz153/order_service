import { Injectable } from '@nestjs/common';
import { CreateCustomFlexDto } from './dto/create-customFlex.dto';
import { UpdateCustomFlexDto } from './dto/update-customFlex.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { CustomFlex } from './entities/customFlex.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResponseDto, PaginationFilterDto } from 'src/common/dto/paginate.dto';

@Injectable()
export class CustomFlexService {
  private readonly repo: BaseRepository<CustomFlex>;
  
  constructor(@InjectModel(CustomFlex.name) private customFlexModel: Model<CustomFlex>) {
    this.repo = new BaseRepository<CustomFlex>(customFlexModel);
  }

  async create(data: CreateCustomFlexDto):Promise<CustomFlex|null> {
    return await this.repo.create(data);
  }

  async update(id: string, data: UpdateCustomFlexDto):Promise<CustomFlex|null> {
    return await this.repo.findOneAndUpdate({ _id: id }, data);
  }

  async remove(id: string):Promise<CustomFlex|null> {
    return await this.repo.remove({ _id: id });
  }

  async findOne(id: string):Promise<CustomFlex|null> {
    return await this.repo.findOne({ _id: id });
  }

  async findAll(query:PaginationFilterDto): Promise<PaginatedResponseDto<CustomFlex>>  {
    return await this.repo.paginate(query);
  }
}
