import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DynamicModule, Global, HttpException, Inject, Logger, Module } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import config from 'src/config';
import { MessageDataReturn, RedisMessageEnum } from './message';

export class MicroserviceClient {
	private logger = new Logger(MicroserviceClient.name);
	constructor(@Inject('MICRO_SERVICE') private client: ClientProxy) {}

	async send<T extends RedisMessageEnum>(
		message: T,
		data: MessageDataReturn[T]['payload'],
	): Promise<MessageDataReturn[T]['return']> {
		try {
			return await firstValueFrom(
				this.client.send<MessageDataReturn[T]['return']>({ cmd: message }, data).pipe(timeout(6000000)),
			);
		} catch (error) {
			console.log('This error ' + error);
			this.logger.error(`[RPC_CALL_TIMEOUT] [MESSAGE] -> [${message}] `, error.stack ?? new Error().stack);
			throw new HttpException('Internal Server Error', 500);
		}
	}
}

@Global()
@Module({})
export class MicroServiceClientModule {
	static register(): DynamicModule {
		return {
			module: MicroServiceClientModule,
			providers: [
				{
					provide: 'MICRO_SERVICE',
					
					useValue: ClientProxyFactory.create({
						transport: Transport.REDIS, 
						options: {
							host: config.redisHost, 
							port:config.redisPort,
							password: config.redisPassword,
						},
					}),
				},
			],
			exports: ['MICRO_SERVICE'],
		};
	}
}
