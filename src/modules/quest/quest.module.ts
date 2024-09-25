import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestService } from './service/quest.service';
import { QuestController } from './controller/quest.controller';
import { Quest } from './entity/quest.entity';
import { User } from "@/modules/user/entities/user.entity";
import { TransactionAnalysisService } from "@/modules/quest/service/analyzer.service";
import { Mileage } from "@/modules/mileage/entity/mileage.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Quest, User, Mileage])],
    providers: [QuestService, TransactionAnalysisService],
    controllers: [QuestController],
    exports: [TransactionAnalysisService]
})
export class QuestModule {}
