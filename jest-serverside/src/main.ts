import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded } from 'express';

/**
 * Test for serverside skill
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Swagger setting
   */
  const config = new DocumentBuilder()
    .setTitle('jest-serverside OpenAPI Document')
    .setDescription('test api document comment!')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v3', app, document);

  // app.use(helmet.contentSecurityPolicy());
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.use(compression());
  app.use(cookieParser());

  await app.listen(4000);
}
bootstrap();
