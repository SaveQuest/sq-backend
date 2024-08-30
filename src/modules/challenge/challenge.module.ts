import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entity/challenge.entity';
import { ChallengeService } from './service/challenge.service';
import { ChallengeController } from './controller/challenge.controller';
import { User } from '@/modules/user/entities/user.entity';
import { Mileage } from "@/modules/mileage/entity/mileage.entity"; "";

@Module({
    imports: [TypeOrmModule.forFeature([Challenge, User]), Mileage], // MileageModule 추가
    providers: [ChallengeService],
    controllers: [ChallengeController],
})
export class ChallengeModule {}
