import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envValidator } from './config/env.validator';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SmsModule } from './modules/sms/sms.module';
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
