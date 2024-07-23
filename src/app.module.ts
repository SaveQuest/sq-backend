import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envValidator } from './configuration/env.validation';
import dataSource from './ormconfig';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envValidator,
  }),
  TypeOrmModule.forRootAsync({
    useFactory: () => dataSource.options
  })],
})

export class AppModule { }
