import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestService } from './service/quest.service';
import { QuestController } from './controller/quest.controller';
import { Challenge } from './entity/quest.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Challenge])],
    providers: [QuestService],
    controllers: [QuestController],
})
export class QuestModule {}