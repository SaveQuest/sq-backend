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

    @Post('create')
    async createQuest(@Request() req: IncomingMessage): Promise<Quest[]> {
        return await this.analyzerService.createQuest(req.userId);
    }

    @Get()
    async getQuestList(@Request() req: IncomingMessage): Promise<Quest[]> {
        return await this.questService.getQuestList(req.userId);
    }



}
