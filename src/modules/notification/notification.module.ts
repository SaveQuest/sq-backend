import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from "@/modules/notification/entities/notification.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification])
  ],
  exports: [
    TypeOrmModule
  ],
})
export class NotificationModule {}
