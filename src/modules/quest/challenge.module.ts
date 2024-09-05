import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeService } from './service/challenge.service';
import { ChallengeController } from './controller/challenge.controller';
import { Quest } from './entity/challenge.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Quest])],
    providers: [ChallengeService],
    controllers: [ChallengeController],
})
export class QuestModule {}
