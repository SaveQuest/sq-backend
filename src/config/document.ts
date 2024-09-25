import { DocumentBuilder } from '@nestjs/swagger';
import { version } from '../../package.json';

export const DocumentConfig = new DocumentBuilder()
  .setTitle('SaveQuest API')
  .setDescription('API documentation for the SaveQuest mobile application.')
  .setVersion(version)
  .addServer('http://localhost:3000', 'Local development server')
  .addServer('https://sq-production-v0.mintpasta.store/', 'Test Server (Production Mode)')
  .addServer('https://savequest.ychan.me/', 'Production Server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'accessToken',
  )
  .build();