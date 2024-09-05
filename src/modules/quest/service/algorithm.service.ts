import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest } from '../entity/quest.entity';
import { User } from "@/modules/user/entities/user.entity";

import * as OTTMedia from '../algorithm/machine/ottmedia.machine';
import { Mileage } from "@/modules/mileage/entity/mileage.entity";

@Injectable()
export class AlgorithmService {
  constructor(
    @InjectRepository(Quest)
    private readonly questRepository: Repository<Quest>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async generateDailyQuests(userId: number): Promise<Quest[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const recommendedQuests = [];

    for (const record of user.mileage) {
      if (OTTMedia.match(record.merchantName)) {
        recommendedQuests.push(
          OTTMedia.generate(record.merchantName)
        )
      }
    }

    return recommendedQuests;
  }

  async checkQuestCompletion(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['quests'],
    });

    for (const record of user.mileage) {
      for (const quest of user.quests) {
        if (OTTMedia.match(record.merchantName)) {
          if (quest.deadline < new Date()) {
            if (OTTMedia.check(record, quest)) {
              quest.status = 'completed';
              user.points += quest.reward;
            } else {
              quest.status = 'failed';
            }
            await this.questRepository.save(quest);
          }
        }
      }
    }
  }
}
