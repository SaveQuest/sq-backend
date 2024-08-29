import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeService } from './service/challenge.service';
import { ChallengeController } from './controller/challenge.controller';
import { Challenge } from './entity/challenge.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Challenge])],
    providers: [ChallengeService],
    controllers: [ChallengeController],
})
export class ChallengeModule {}