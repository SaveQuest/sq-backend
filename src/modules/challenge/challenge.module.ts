import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entity/challenge.entity';
import { ChallengeService } from './service/challenge.service';
import { ChallengeController } from './controller/challenge.controller';
import { User } from '@/modules/user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Challenge, User])],
    providers: [ChallengeService],
    controllers: [ChallengeController],
})
export class ChallengeModule {}
