import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PricingCycleEnum } from '../dto/create-subscriptionPlan.dto';

@Schema({ timestamps: true }) // Enables createdAt and updatedAt fields automatically
export class SubscriptionPlan extends Document {
  @Prop({ required: true, trim: true }) // Trim whitespace for better input handling
  name: string;

  @Prop({ required: true, min: 0 }) // Ensure pricing is non-negative
  pricing: number;

  @Prop({ required: true, enum: PricingCycleEnum, type: String }) // Explicit type definition
  pricingCycle: PricingCycleEnum;

  @Prop({ type: Map, of: String, required: true }) // More efficient way to store key-value pairs
  features: Map<string, string>;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
