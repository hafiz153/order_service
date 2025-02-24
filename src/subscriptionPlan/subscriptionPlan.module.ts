import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscriptionPlan.service';
import { SubscriptionPlanController } from './subscriptionPlan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionPlan, SubscriptionPlanSchema } from './entities/subscriptionPlan';
import { MicroserviceClient } from 'src/common/redis/microserviceClientModule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from 'src/config';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubscriptionPlan.name, schema: SubscriptionPlanSchema }]),
    // ClientsModule.register([
		// 	{
		// 		name: 'MICRO_SERVICE',
		// 		transport: Transport.REDIS,
		// 		options: {
    //       host: config?.redisHost,
    //       port: 6379,
		// 			password:config?.redisPassword
		// 		},
		// 	},
		// ]),
  ],
  controllers: [SubscriptionPlanController],
  providers: [SubscriptionPlanService,MicroserviceClient],
})
export class SubscriptionPlanModule {}
