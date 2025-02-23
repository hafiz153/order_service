import { Module } from '@nestjs/common';
import { CustomFlexController } from './customFlex.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomFlex, CustomFlexSchema } from './entities/customFlex.entity';
import { CustomFlexService } from './customFlex.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomFlex.name, schema: CustomFlexSchema },
    ]),
  ],
  controllers: [CustomFlexController],
  providers: [CustomFlexService],
})
export class CustomFlexModule {}
