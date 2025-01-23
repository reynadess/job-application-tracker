import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const logger = new Logger(AppModule.name);
  // Swagger OpenAPI
  const options = new DocumentBuilder()
    .setTitle('Job Application Tracker API')
    .setDescription('API for tracking job applications')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, documentFactory(), {
    jsonDocumentUrl: 'swagger/json',
  });
  logger.log(
    `Swagger UI available at http://localhost:${process.env.PORT ?? 3000}/swagger`,
  );
  logger.log(process.env.DATABASE_PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
