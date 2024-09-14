import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestService } from './service/quest.service';
import { QuestController } from './controller/quest.controller';
import { Quest } from './entity/quest.entity';
import { User } from "@/modules/user/entities/user.entity";
import { CardTransactionAnalyzerService } from "@/modules/quest/service/analyzer.service";

@Module({
    imports: [TypeOrmModule.forFeature([Quest, User])],
    providers: [QuestService, CardTransactionAnalyzerService],
    controllers: [QuestController],
})
export class QuestModule {}
