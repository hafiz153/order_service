import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema({ timestamps: true })
export class Test extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: '6793313715a71e6f71b4ae31',
  })
  role?: mongoose.Schema.Types.ObjectId;
}

export const TestSchema = SchemaFactory.createForClass(Test);
