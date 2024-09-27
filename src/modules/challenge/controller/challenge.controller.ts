// quest.controller.ts
import { Controller, Post, Param, Get, Request, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChallengeService } from "@/modules/challenge/service/challenge.service";
import { IncomingMessage } from 'http';
import { CreateChallengeDto } from "@/modules/challenge/dto/CreateChallenge.dto";

@Controller('challenge')
@ApiTags("챌린지")
@ApiBearerAuth(
  "accessToken"
)
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService,
    ) { }

    @Post('create')
    @ApiOperation({
        summary: "챌린지 생성",
        description: "챌린지를 생성합니다."
    })
    async createChallenge(
      @Request() req: IncomingMessage,
      @Body() challengeDto: CreateChallengeDto,
    ): Promise<any> {
        return await this.challengeService.createChallenge(req.userId, challengeDto);
    }


    // 챌린지 목록을 가져오는 API
    @Get('/')
    @ApiOperation({
        summary: "챌린지 목록 조회",
        description: "현재 진행중인 모든 챌린지들의 제목, 참가자 수, 상금, 기간, 입장비를 리턴합니다."
    })
    async getChallengeList(@Request() req: IncomingMessage) {
        const challenges = await this.challengeService.getChallengeList(req.userId);
        return { challenges };
    }

    @Get('dst')
    @ApiOperation({
        summary: "DST 조회",
        description: "챌린지 화면 DST를 조회합니다."
    })
    async getDst(@Request() req: IncomingMessage) {
        return await this.challengeService.getDst(req.userId);
    }


    // 챌린지 세부 정보 반환 API
    @Get(':id/detail')
    @ApiOperation({
        summary: "특정 챌린지 세부사항",
        description: "특정 챌린지의 세부사항(제목, 입장료, 상금, 기간)들을 리턴합니다."
    })
    async getChallengeDetails(@Param('id') challengeId: string): Promise<any> {
        return this.challengeService.getChallengeDetails(challengeId);
    }


    // 참가자 추가 API
    @Post(':id/join')
    @ApiOperation({
        summary: "챌린지 참가",
        description: "해당 챌린지에 유저를 추가합니다."
    })
    async joinChallenge(@Param('id') challengeId: string, @Request() req: IncomingMessage): Promise<{
        success: boolean;
        id: string
    }> {
        return this.challengeService.joinChallenge(challengeId, req.userId);
    }


    @Get(':id/ranking')
    @ApiOperation({
        summary: "랭킹반환",
        description: "현재 진행중인 챌린지에서 모든 참여자들의 순위를 리턴합니다."
    })
    async getChallengeRankings(@Param('id') challengeId: string): Promise<{ ranking: Record<string, any[]> }> {
        const ranking = await this.challengeService.getChallengeRankings(challengeId);
        return { ranking }
    }
}
