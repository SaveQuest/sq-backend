import { Controller, Get, Post, Delete, Param, Request } from '@nestjs/common';
import { QuestService } from '../service/quest.service';
import { Quest } from '../entity/quest.entity';
import { User } from '@/modules/user/entities/user.entity';
import { IncomingMessage } from "http";
import { TransactionAnalysisService } from "@/modules/quest/service/analyzer.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('quest')
@ApiTags("도전과제")
@ApiBearerAuth(
  "accessToken"
)
export class QuestController {
    constructor(
      private readonly questService: QuestService,
      private readonly analyzerService: TransactionAnalysisService,
    ) {}

    // // 도전과제 조회
    @Get('daily')
    async getTopFiveChallenge(): Promise<Quest[]> {
        return this.questService.getTopFiveChallenges();
    }

    // // 특정 카테고리별
    // @Get(':category')
    // async getChallengeByCategory(@Param('category') category: string): Promise<Quest> {
    //     return this.questService.getChallengeByCategory(category);
    // }

    // 도전과제 생성
    // @Post()
    // async createQuest(@Request() req: IncomingMessage): Promise<Quest[]> {
    //     const
    // }

    // @Post("checkStatus")
    // async checkQuestCompletion(@Request() req: IncomingMessage): Promise<void> {
    //     await this.algorithmService.checkQuestCompletion(req.userId);
    // }

    // 도전과제 삭제
    @Delete(':id')
    async deleteChallenge(@Param('id') id: number): Promise<void> {
        return this.questService.deleteChallenge(id);
    }
}
