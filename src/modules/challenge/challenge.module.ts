import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './entity/challenge.entity';
import { ChallengeService } from './service/challenge.service';
import { ChallengeController } from './controller/challenge.controller';
import { User } from '@/modules/user/entities/user.entity';
import { ScheduleModule } from "@nestjs/schedule";
import { ScheduledTask } from "@/modules/challenge/entity/task.entity";
import { TasksSchedulerService } from "@/modules/challenge/service/task.service";

@Module({
    imports: [
      ScheduleModule.forRoot(),
      TypeOrmModule.forFeature([Challenge, User, ScheduledTask])
    ],
    providers: [ChallengeService, TasksSchedulerService],
    controllers: [ChallengeController],
})
export class ChallengeModule {}
