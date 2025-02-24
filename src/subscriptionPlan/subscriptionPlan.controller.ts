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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionPlanService } from './subscriptionPlan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscriptionPlan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscriptionPlan.dto';
import { PaginationFilterDto } from 'src/common/dto/paginate.dto';
import { MicroserviceClient } from 'src/common/redis/microserviceClientModule';
import { RedisMessageEnum } from 'src/common/redis/message';

@ApiTags('SubscriptionPlans') // Group APIs under "SubscriptionPlans"
@Controller('subscriptionPlan')
export class SubscriptionPlanController {
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly redis:MicroserviceClient
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subscriptionPlan record' })
  @ApiResponse({
    status: 201,
    description: 'SubscriptionPlan record created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  async create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto): Promise<any> {
    return await this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptionPlan records with pagination' })
  @ApiResponse({ status: 200, description: 'List of subscriptionPlan records.' })
  findAll(@Query() query: PaginationFilterDto) {
    return this.subscriptionPlanService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific subscriptionPlan record by ID' })
  @ApiResponse({ status: 200, description: 'SubscriptionPlan record found.' })
  @ApiResponse({ status: 404, description: 'SubscriptionPlan record not found.' })
  findOne(@Param('id') id: string) {
    return this.subscriptionPlanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing subscriptionPlan record' })
  @ApiResponse({
    status: 200,
    description: 'SubscriptionPlan record updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  @ApiResponse({ status: 404, description: 'SubscriptionPlan record not found.' })
  update(@Param('id') id: string, @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    return this.subscriptionPlanService.update(id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscriptionPlan record by ID' })
  @ApiResponse({
    status: 200,
    description: 'SubscriptionPlan record deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'SubscriptionPlan record not found.' })
  remove(@Param('id') id: string) {
    return this.subscriptionPlanService.remove(id);
  }
  
  @Get('message/test')
  async test(): Promise<any>{
    return await this.redis.send(RedisMessageEnum.TEST, {name:"hafiz"})
  }
}
