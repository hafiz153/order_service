import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionPlanDto } from './create-subscriptionPlan.dto';

export class UpdateSubscriptionPlanDto extends PartialType(CreateSubscriptionPlanDto) {}
