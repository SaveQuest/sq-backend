import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envValidator } from './config/env.validator';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SmsModule } from './modules/sms/sms.module';
import { QuestModule } from './modules/quest/quest.module';
import { MileageModule } from './modules/mileage/mileage.module';
import { ShopModule } from './modules/shop/shop.module';
import { StaticFileModule } from './modules/staticfile/staticfile.module';
import dataSource from './ormconfig';

import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { SeedingModule } from './modules/seeding/seeding.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: envValidator,
  }),
  TypeOrmModule.forRootAsync({
    useFactory: () => dataSource.options,
    async dataSourceFactory(option) {
      if (!option)
        throw new Error('Invalid options passed');

      return addTransactionalDataSource(new DataSource(option));
    }
  }),
    UserModule,
    AuthModule,
    SmsModule,
    SeedingModule,
    ShopModule,
    MileageModule,
    QuestModule,
    StaticFileModule,
  ],
  controllers: [],
})


export class AppModule { }
