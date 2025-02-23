import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Types } from 'mongoose';
import { MongoObjectID } from 'src/common/types';

export class CreateCustomFlexDto {
  
  @ApiProperty({ description: 'User ID', example: '6793313715a71e6f71b4ae31' })
  @IsMongoId()
  userID: MongoObjectID;

  @ApiProperty({ description: 'Subscription Plan ID', example: '6793313715a71e6f71b4ae31' })
  @IsMongoId()
  subscriptionPlanID: MongoObjectID;

  @ApiProperty({ description: 'Custom subscription price', example: 29.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Status of the custom plan', example: 'active', enum: ['active', 'expired', 'cancelled'] })
  @IsOptional()
  @IsEnum(['active', 'expired', 'cancelled'])
  status?: string;

  @ApiProperty({ description: 'Whether the subscription is active', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
