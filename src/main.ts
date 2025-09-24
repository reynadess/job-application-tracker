import {
    ClassSerializerInterceptor,
    Logger,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    }); // TODO Update this for production

    const logger = new Logger('Main');
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
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
