import { Controller, Get, Post, Delete, Param, Request, Headers, Body } from "@nestjs/common";
import { QuestService } from '../service/quest.service';
import { Quest } from '../entity/quest.entity';
import { User } from '@/modules/user/entities/user.entity';
import { IncomingMessage } from "http";
import { TransactionAnalysisService } from "@/modules/quest/service/analyzer.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QuestDST } from "@/modules/quest/interface";

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

    @Get('dst')
    async getDst(@Request() req: IncomingMessage): Promise<QuestDST> {
        return await this.questService.getDst(req.userId);
    }

    @Get('daily')
    async getDailyQuest(@Request() req: IncomingMessage): Promise<{ reward: number; name: string; id: string }[]> {
        return await this.questService.getDailyQuest(req.userId);
    }

    @Post('daily/select')
    async selectDailyQuest(@Request() req: IncomingMessage, @Body('quest') quest: string[]): Promise<void> {
        await this.questService.selectDailyQuest(req.userId, quest);
    }

    @Get("list")
    @ApiOperation({
        summary: "도전과제 목록 조회",
        description: "사용자의 도전과제 목록을 조회합니다. (로그인 필요)"
    })
    @ApiResponse({
        status: 200,
        description: "도전과제 목록 조회 성공",
        content: {
            "application/json": {
                example: [{
                    "reward": 500,
                    "name": "편의점 3500원 이하로 쓰기",
                    "dailyUsage": 0,
                    "limitUsage": 3500,
                }, {
                    "reward": 500,
                    "name": "편의점 3500원 이하로 쓰기",
                    "dailyUsage": 0,
                    "limitUsage": 3500,
                }]
            }
        }
    })
    async getQuestList(
      @Request() req: IncomingMessage,
      @Headers('X-DUMMY-MODE') isDummyMode: boolean,
    ): Promise<Quest[]> {
        return await this.questService.getActiveQuestList(req.userId);
    }



}
