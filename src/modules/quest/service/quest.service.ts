import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Quest } from "../entity/quest.entity";
import { User } from "@/modules/user/entities/user.entity";
import { QuestDST, QuestDSTElement } from "@/modules/quest/interface";
import { ColorPrimaryLibrary } from "@/interface/frontendStyle";

@Injectable()
export class QuestService {
    constructor(
        @InjectRepository(Quest)
        private readonly challengeRepository: Repository<Quest>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

    ) {}
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
