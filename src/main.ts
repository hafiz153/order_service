import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './config';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceotpr';
import { AllExceptionsFilter } from './common/exceptions/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT authentication for Swagger
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  //middlewares
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          success: false,
          errorCode: 400,
          message: 'Validation failed',
          errors: errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          })),
        });
      },
    })
  );
  
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  const port = config.port;
  await app.listen(port ?? 3000);
  console.log(`Application is running on http://localhost:${port}/api/docs`);
}
bootstrap();
