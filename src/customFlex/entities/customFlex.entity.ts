import { MongoObjectID } from './../../common/types/index';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CustomFlex extends Document {
  
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true })
  userID: MongoObjectID;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', index: true })
  subscriptionPlanID: MongoObjectID;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true }) 
  isActive: boolean;

  @Prop({ enum: ['active', 'expired', 'cancelled'], default: 'active' }) 
  status: string;
}

export const CustomFlexSchema = SchemaFactory.createForClass(CustomFlex);

