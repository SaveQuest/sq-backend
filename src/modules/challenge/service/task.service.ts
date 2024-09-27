import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScheduledTask } from '@/modules/challenge/entity/task.entity';
import { LessThanOrEqual, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Challenge } from "@/modules/challenge/entity/challenge.entity";
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class TasksSchedulerService {
  private readonly logger = new Logger(TasksSchedulerService.name);
  private readonly checkInterval = 1000 * 60;

  constructor(
    @InjectRepository(ScheduledTask)
    private readonly taskRepository: Repository<ScheduledTask>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  onModuleInit() {
    this.startCheckingTime();
  }

  private startCheckingTime() {
    setInterval(async () => {
      const now = new Date();

      const tasks = await this.taskRepository.find({
        where: {
          scheduledTime: LessThanOrEqual(now),
          isExecuted: false,
        },
      });

      for (const task of tasks) {
        await this.executeTask(task);
      }
    }, this.checkInterval);
  }

  private async executeTask(task: ScheduledTask) {
    this.logger.log(`[ChallengeScheduler] Task Name: ${task.taskName}, id: ${task.id} is executed.`);
    task.isExecuted = true;
    const challenge = await this.challengeRepository.findOne({ where: { id: task.id }});
    await this.challengeRepository.update(challenge.id, { isFinished: true });
    await this.finishChallenge(challenge);
    await this.taskRepository.save(task);
  }

  async finishChallenge(challenge: Challenge) {
    await this.challengeRepository.update(challenge.id, { isFinished: true });
    const sortedKeys = Object.keys(challenge.usage).sort((a, b) => challenge.usage[a] - challenge.usage[b]);
    for (const key of sortedKeys) {
      const index = sortedKeys.indexOf(key);
      const user = await this.userRepository.findOne({ where: { id: Number(key) } });
      if (index === 0) {
        user.points += challenge.prize;
        await this.userRepository.save(user);
      } else if (index === 1 || index === 2) {
        user.points += challenge.prize / 3;
        await this.userRepository.save(user);
      }
    }
  }

  async registerNewTask(taskName: string, challengeId: string, scheduledTime: Date) {
    const newTask = this.taskRepository.create({
      id: challengeId,
      taskName,
      scheduledTime,
      isExecuted: false,
    });
    await this.taskRepository.save(newTask);
    this.logger.log(`Registered new task: ${taskName} for ${scheduledTime}`);
  }
}