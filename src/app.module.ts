import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envValidator } from './configuration/env.validation';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import dataSource from './ormconfig';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envValidator,
  }),
  TypeOrmModule.forRootAsync({
    useFactory: () => dataSource.options
  }),
    UserModule,
    AuthModule,
    SmsModule,],
  controllers: [],
})

export class AppModule { }
