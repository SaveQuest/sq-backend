// challenge.controller.ts
import { Controller, Post, Param, Get, Body } from "@nestjs/common";
import { ChallengeService } from "../service/challenge.service";
import { Challenge } from "../entity/challenge.entity";

@Controller('challenges')
export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) { }

    // 참가자 추가 API
    @Post(':id/join/:userId')
    async joinChallenge(@Param('id') challengeId: number, @Param('userId') userId: number): Promise<string> {
        return this.challengeService.addParticipant(challengeId, userId);
    }

    // 우승자 계산 API
    @Get(':id/winner')
    async getChallengeWinner(@Param('id') challengeId: number): Promise<string> {
        return this.challengeService.calculateWinner(challengeId);
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
}
