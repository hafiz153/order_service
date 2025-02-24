import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './test/test.module';
import config from './config';
import { SubscriptionPlanModule } from './subscriptionPlan/subscriptionPlan.module';
import { CustomFlexModule } from './customFlex/customFlex.module';
import { MicroServiceClientModule } from './common/redis/microserviceClientModule';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoURL),
    MicroServiceClientModule.register(),
    TestModule,
    SubscriptionPlanModule,
    CustomFlexModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
