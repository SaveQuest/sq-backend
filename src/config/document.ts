import { DocumentBuilder } from '@nestjs/swagger';
import { version } from '../../package.json';

export const DocumentConfig = new DocumentBuilder()
  .setTitle('SaveQuest API')
  .setDescription('API documentation for the SaveQuest mobile application.')
  .setVersion(version)
  .build();