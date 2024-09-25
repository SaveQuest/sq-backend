import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quest } from "../entity/quest.entity";
import { User } from "@/modules/user/entities/user.entity";
import { QuestDST, QuestDSTElement } from "@/modules/quest/interface";
import { ColorPrimaryLibrary } from "@/interface/frontendStyle";
import { TransactionAnalysisService } from "@/modules/quest/service/analyzer.service";

@Injectable()
export class QuestService {
    constructor(
        @InjectRepository(Quest)
        private readonly questRepository: Repository<Quest>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly analyzerService: TransactionAnalysisService,
    ) {}

    isOverOneWeekFromToday(date: Date | string): boolean {
        const inputDate = new Date(date);
        const today = new Date();

        const timeDifference = Math.abs(today.getTime() - inputDate.getTime());
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        return timeDifference > oneWeekInMilliseconds;
    }


    async getDailyQuest(userId: number): Promise<{ reward: number; name: string; id: string }[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                quests: true,
                generatedQuests: true,
            }
        });
        if (this.isOverOneWeekFromToday(user.lastQuestGeneratedAt)) {
            if (user.quests.length > 0) {
                await this.rewardDailyQuest(user);
            }
            const newGeneratedQuest = await this.analyzerService.createQuest(userId);
            return newGeneratedQuest.map(quest => ({id: quest.id, name: quest.name, reward: quest.reward}));
        } else {
            return user.generatedQuests.map(quest => ({id: quest.id, name: quest.name, reward: quest.reward}));
        }
    }

    async rewardDailyQuest(user: User): Promise<void> {
        const userQuests = user.quests;
        for (const quest of userQuests) {
            if (quest.totalUsage <= quest.limitUsage) {
                user.points += quest.reward;
                user.exp += quest.rewardExp;
                quest.status = 'completed';
            }
        }
        await this.userRepository.save(user);
    }

    async selectDailyQuest(userId: number, questIds: string[]): Promise<Record<string, string | Quest[]>> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                quests: true,
                generatedQuests: true,
            }
        });
        console.log(user.generatedQuests)
        const existingQuestIds = questIds.every(questId => user.generatedQuests.some(quest => quest.id === questId));
        if (!existingQuestIds) {
            throw new Error('Invalid quest id');
        }
        const selectedQuests = user.generatedQuests.filter(quest => questIds.includes(quest.id));
        user.quests = user.quests.concat(selectedQuests);
        user.generatedQuests = []
        await this.userRepository.save(user);
        return {status: "success", selectedQuests: selectedQuests}
    }

    async getDst(userId: number): Promise<QuestDST>  {
        const quests = await this.getActiveQuestList(userId);
        const dstElement: QuestDSTElement[] = [];
        for (const quest of quests) {
            dstElement.push({
                type: 'QUEST_INFO_CARD',
                top: {
                    topRowText: quest.reward.toString(),
                    bottomRowText: quest.name,
                },
                right: {
                    topRowText: '오늘까지 사용한 금액',
                    bottomRowText: '₩ ' + quest.totalUsage.toLocaleString('en-US'),
                },
                left: {
                    topRowText: '한도 금액',
                    bottomRowText: '₩ ' + quest.limitUsage.toLocaleString('en-US'),
                },
                bottom: {
                    percent: quest.totalUsage / quest.limitUsage * 100,
                    color: quest.totalUsage > quest.limitUsage ? ColorPrimaryLibrary.FAIL : ColorPrimaryLibrary.SAFE,
                },
            });
        }
        return {
            id: userId,
            element: dstElement,
        };
    }

    async getActiveQuestList(userId: number): Promise<Quest[]> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: {
                quests: true,
            }
        });
        return user.quests.filter(quest => quest.status === 'inProgress');
    }
}
