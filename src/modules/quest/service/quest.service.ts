import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quest } from '../entity/quest.entity';
import { User } from '@/modules/user/entities/user.entity';

@Injectable()
export class QuestService {
    constructor(
        @InjectRepository(Quest)
        private readonly challengeRepository: Repository<Quest>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) {}

    async getQuestList(userId: number): Promise<Quest[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        return user.quests;
    }
}
