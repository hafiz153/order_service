import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StatusEnum } from 'src/common/enums/status.enum';
@Schema()
export class Permission extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ enum:StatusEnum})
  status: string;

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
