import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService } from './common/nest/logger/custom-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const customLogger = app.get(CustomLoggerService);
  app.useLogger(customLogger);

  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture')
    .setDescription('API to manage properties and harvests')
    .setVersion('1.0')
    .addTag('agriculture')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
