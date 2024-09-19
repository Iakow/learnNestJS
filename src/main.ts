import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line
const cookieSession = require('cookie-session');
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('CarValue example')
    .setDescription('The CarValue API description')
    .setVersion('1.0')
    // .addTag('cars')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'CarValue API',
  });

  app.use(cookieSession({ keys: ['alakjshdflkj'] }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(configService.get('PORT'));
}
bootstrap();
