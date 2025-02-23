import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum PricingCycleEnum {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export class CreateSubscriptionPlanDto {
  @ApiProperty({
    description: 'Name of the subscriptionPlan',
    example: 'IELTS Speaking SubscriptionPlan',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Price of the subscriptionPlan', example: 29.99 })
  @IsNumber()
  @Min(0)
  pricing: number;

  @ApiProperty({
    description: 'Pricing cycle of the subscriptionPlan',
    enum: PricingCycleEnum,
    example: PricingCycleEnum.MONTHLY,
  })
  @IsEnum(PricingCycleEnum)
  @IsNotEmpty()
  pricingCycle: PricingCycleEnum;

  @ApiProperty({
    description: 'Features of the subscriptionPlan',
    example: { duration: '60 minutes', sections: '4' },
  })
  @IsObject()
  @IsNotEmpty()
  features: Map<string, string>;
}
