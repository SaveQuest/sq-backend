// quest.controller.ts
import { Controller, Post, Param, Get, Request } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ChallengeService } from "@/modules/challenge/service/challenge.service";
import { IncomingMessage } from 'http';

@Controller('challenge')
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService,
    ) { }

    // 챌린지 목록을 가져오는 API
    @Get('/')
    @ApiOperation({
        summary: "챌린지 목록 조회",
        description: "현재 진행중인 모든 챌린지들의 제목, 참가자 수, 상금, 기간, 입장비를 리턴합니다."
    })
    async getChallengeList() {
        return await this.challengeService.getChallengeList();
    }


    // 유저 본인이 참가 중인 챌린지 조회
    @Get('active/:userId')
    @ApiOperation({
        summary: "참가한 진행중인 챌린지 조회",
        description: "유저가 참가한 챌린지중 진행중인 챌린지만을 리턴합니다.  -- 유저아이디 요청필요"
    })
    async getUserActiveChallenges(@Request() req: IncomingMessage) {
        return await this.challengeService.getUserActiveChallenges(req.userId);
    }


    // 챌린지 세부 정보 반환 API
    @Get(':id/details')
    @ApiOperation({
        summary: "참여한 챌린지 세부사항",
        description: "현재 참가한 챌린지의 세부사항(제목, 입장료, 상금, 기간)들을 리턴합니다.   -- 챌린지아이디 요청필요" 
    })
    async getChallengeDetails(@Param('id') challengeId: number): Promise<any> {
        return this.challengeService.getChallengeDetails(challengeId);
    }


    // 챌린지 추가 엔드포인트
    // @Post('create')
    // async createChallenge(
    //     @Body('title') title: string,
    //     @Body('entryFee') entryFee: number,
    //     @Body('prize') prize: number,
    //     @Body('endDate') endDate: Date,
    // ): Promise<Challenge> {
    //     return this.challengeService.createChallenge(title, entryFee, prize, endDate);
    // }


    // 참가자 추가 API
    @Post(':id/join/:userId')
    @ApiOperation({
        summary: "챌린지 참가",
        description: "해당 챌린지에 유저를 추가합니다.   -- 유저아이디, 챌린지아이디 요청필요"
    })
    async joinChallenge(@Param('id') challengeId: number, @Request() req: IncomingMessage): Promise<string> {
        return this.challengeService.addParticipant(challengeId, req.userId);
    }


    // 챌린지에 참가한 유저들의 소비 현황 순위 반환 API
    // * typeorm jointable 오류 해결 안됨
    // @Get(':id/rankings')
    // @ApiOperation({
    //     summary: "랭킹반환",
    //     description: "현재 진행중인 챌린지에서 모든 참여자들의 순위를 리턴합니다.   -- 유저아이디 요청필요"
    // })
    // async getChallengeRankings(@Param('id') challengeId: number): Promise<any[]> {
    //     return this.challengeService.getParticipantRankings(challengeId);
    // }


    // // 우승자 계산 API
    // 챌린지 종료시 그때 계산
    //
    // @Get(':id/winner')
    // @ApiOperation({
    //     summary: "챌린지 목록 조회",
    //     description: "현재 진행중인 모든 챌린지들의 제목, 참가자 수, 상금, 기간, 입장비를 리턴합니다."
    // })
    // async getChallengeWinner(@Request() req: IncomingMessage): Promise<string> {
    //     return this.challengeService.calculateWinner(req.userId);
    // }


    // 챌린지를 종료하는 API
    @Post('complete/:id')
    @ApiOperation({
        summary: "챌린지 종료",
        description: "해당 챌린지를 종료합니다.  -- 챌린지아이디 요청필요"
    })
    async completeChallenge(@Param('id') challengeId: number) {
        return await this.challengeService.completeChallenge(challengeId);
    }


    // 유저 본인이 참가한 완료된 챌린지 조회
    // @Get('finished/:userId')
    // @ApiOperation({
    //     summary: "종료된 챌린지 조회",
    //     description: "참여 기록이 있는 종료된 챌린지 목록을 리턴합니다.  -- 유저아이디 요청필요"
    // })
    // async getUserFinishedChallenges(@Request() req: IncomingMessage) {
    //     return await this.finishedChallengeService.getUserFinishedChallenges(req.userId);
    // }
}
