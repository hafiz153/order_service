import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // Add password field

  @Prop()
  age: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Role', default: [] })
  roles?: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String })
  refreshToken: { type: String }; // Optional field to store hashed refresh token
}

export const UserSchema = SchemaFactory.createForClass(User);
