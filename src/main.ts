import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './config';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceptions/all-exception.filter';
import { GlobalResponseTransformer } from './common/interceptors/response.interceotpr';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth({ description: 'User JWT Token', type: 'http', name: 'Authorization', bearerFormat: 'JWT', }) // Enable JWT authentication for Swagger
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document,{
    swaggerOptions: {
      persistAuthorization: true, // 🔥 Keeps auth token even after page reload
    },
  });

  //middlewares
  app.use(helmet());
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new GlobalResponseTransformer());
  app.useGlobalFilters(new AllExceptionsFilter())

  const port = config.port;
  await app.listen(port ?? 3000);
  console.log(`Application is running on http://localhost:${port}/api/docs`);
}
bootstrap();
