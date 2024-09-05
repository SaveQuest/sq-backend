import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeService } from './service/challenge.service';
import { QuestController } from './controller/quest.controller';
import { Quest } from './entity/quest.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quest])],
    providers: [ChallengeService],
    controllers: [QuestController],
})
export class QuestModule {}
