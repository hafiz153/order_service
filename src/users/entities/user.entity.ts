import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, default: '' }) // Image URL property
  image: string;

  @Prop({ required: true })
  password: string; // Add password field

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Role', default: [] })
  roles?: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: String })
  refreshToken: string; // Optional field to store hashed refresh token

}

export const UserSchema = SchemaFactory.createForClass(User);
