import { Injectable } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscriptionPlan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscriptionPlan.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { SubscriptionPlan } from './entities/subscriptionPlan';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaginatedResponseDto,
  PaginationFilterDto,
} from 'src/common/dto/paginate.dto';

@Injectable()
export class SubscriptionPlanService {
  private readonly repo: BaseRepository<SubscriptionPlan>;

  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {
    this.repo = new BaseRepository<SubscriptionPlan>(subscriptionPlanModel);
  }

  async create(
    data: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan | null> {
    return await this.repo.create(data);
  }

  async update(
    id: string,
    data: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan | null> {
    return await this.repo.findOneAndUpdate({ _id: id }, data);
  }

  async remove(id: string): Promise<SubscriptionPlan | null> {
    return await this.repo.remove({ _id: id });
  }

  async findOne(id: string): Promise<SubscriptionPlan | null> {
    return await this.repo.findOne({ _id: id });
  }

  async findAll(
    query: PaginationFilterDto,
  ): Promise<PaginatedResponseDto<SubscriptionPlan>> {
    return await this.repo.paginate(query);
  }
}
