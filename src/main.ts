import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DocumentConfig } from './config/document';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, DocumentConfig);

  // Swagger 설정에 Authorization 헤더 추가
  const config = new DocumentBuilder()
  .setTitle('SaveQuest API')
  .setDescription('API documentation for the SaveQuest mobile application.')
  .setVersion('0.0.1')
  .addServer('http://localhost:3000', 'Local development server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'accessToken',
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document,{
    swaggerOptions: {
      persistAuthorization: true,  // 인증 유지
    },
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}

bootstrap();
