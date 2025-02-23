import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscriptionPlan.service';
import { SubscriptionPlanController } from './subscriptionPlan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionPlan, SubscriptionPlanSchema } from './entities/subscriptionPlan';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubscriptionPlan.name, schema: SubscriptionPlanSchema }]),
  ],
  controllers: [SubscriptionPlanController],
  providers: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
