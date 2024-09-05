// finished-challenge.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinishedChallenge } from './entity/finished_challenge.entity';
import { FinishedChallengeService } from './service/finished_challengeservice';

@Module({
    imports: [TypeOrmModule.forFeature([FinishedChallenge])],
    providers: [FinishedChallengeService],
    exports: [FinishedChallengeService],
})
export class FinishedChallengeModule {}
