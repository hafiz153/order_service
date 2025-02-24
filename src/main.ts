import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all-exception.filter';
import { GlobalResponseTransformer } from './common/interceptors/response.interceotpr';
import config from './config';

async function bootstrap() {
  // ✅ 1️⃣ Start HTTP API for Swagger, global pipes, etc.
  const app = await NestFactory.create(AppModule);

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth({ description: 'User JWT Token', type: 'http', name: 'Authorization', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  // Middlewares & Global Configs
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new GlobalResponseTransformer());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(config.port); // HTTP Service
  console.log(`🚀 API is running at http://localhost:${config.port}/api/docs`);

  // ✅ 2️⃣ Start Redis Microservice for Background Processing
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.REDIS,
    options: {
      host: config?.redisHost,
      port: config?.redisPort,
      password:config.redisPassword,
      retryAttempts: 5,
      retryDelay: 5000,
    },
  });

  await microservice.listen();
  console.log(`🔥 Redis Microservice is running`);
}

bootstrap();
