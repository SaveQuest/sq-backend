// challenge.controller.ts
import { Controller, Post, Param, Get, Body } from "@nestjs/common";
import { ChallengeService } from "../service/challenge.service";
import { Challenge } from "../entity/challenge.entity";
import { FinishedChallengeService } from "@/modules/finished_challenge/service/finished_challengeservice";

@Controller('challenges')
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService,
        private readonly finishedChallengeService: FinishedChallengeService,
    ) { }

    // 챌린지 목록을 가져오는 API
    @Get('/')
    async getChallengeList() {
        return await this.challengeService.getChallengeList();
    }


    // 유저 본인이 참가 중인 챌린지 조회
    @Get('active/:userId')
    async getUserActiveChallenges(@Param('userId') userId: number) {
        return await this.challengeService.getUserActiveChallenges(userId);
    }


    // 챌린지 세부 정보 반환 API
    @Get(':id/details')
    async getChallengeDetails(@Param('id') challengeId: number): Promise<any> {
        return this.challengeService.getChallengeDetails(challengeId);
    }


    // 챌린지 추가 엔드포인트
    @Post('create')
    async createChallenge(
        @Body('title') title: string,
        @Body('entryFee') entryFee: number,
        @Body('prize') prize: number,
        @Body('endDate') endDate: Date,
    ): Promise<Challenge> {
        return this.challengeService.createChallenge(title, entryFee, prize, endDate);
    }


    // 참가자 추가 API
    @Post(':id/join/:userId')
    async joinChallenge(@Param('id') challengeId: number, @Param('userId') userId: number): Promise<string> {
        return this.challengeService.addParticipant(challengeId, userId);
    }


    // 챌린지에 참가한 유저들의 소비 현황 순위 반환 API
    // * typeorm jointable 오류 해결 안됨
    @Get(':id/rankings')
    async getChallengeRankings(@Param('id') challengeId: number): Promise<any[]> {
        return this.challengeService.getParticipantRankings(challengeId);
    }


    // // 우승자 계산 API
    // @Get(':id/winner')
    // async getChallengeWinner(@Param('id') challengeId: number): Promise<string> {
    //     return this.challengeService.calculateWinner(challengeId);
    // }


    // 챌린지를 종료하는 API
    @Post('complete/:id')
    async completeChallenge(@Param('id') challengeId: number) {
        return await this.challengeService.completeChallenge(challengeId);
    }


    // 유저 본인이 참가한 완료된 챌린지 조회
    @Get('finished/:userId')
    async getUserFinishedChallenges(@Param('userId') userId: number) {
        return await this.finishedChallengeService.getUserFinishedChallenges(userId);
    }
}
