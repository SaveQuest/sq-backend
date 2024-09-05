import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestService } from './service/quest.service';
import { QuestController } from './controller/quest.controller';
import { Quest } from './entity/quest.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quest])],
    providers: [QuestService],
    controllers: [QuestController],
})
export class QuestModule {}
