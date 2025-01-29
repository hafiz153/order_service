import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import config from './config';

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
  const port = config.port;
  await app.listen(port ?? 3000);
  console.log(`Application is running on http://localhost:${port}/api/docs`);
}
bootstrap();
