import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mileage } from './entity/mileage.entity';
import { MileageService } from './service/mileage.service';
import { MileageController } from './controller/mileage.controller';
import { UserModule } from '../user/user.module';
import { QuestModule } from "@/modules/quest/quest.module";

@Module({
    imports: [TypeOrmModule.forFeature([Mileage]), UserModule, QuestModule],
    controllers: [MileageController],
    providers: [MileageService],
    exports: [MileageService],
  })
  export class MileageModule {}
