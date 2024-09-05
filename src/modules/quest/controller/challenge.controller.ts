import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ChallengeService } from '../service/challenge.service';
import { Quest } from '../entity/challenge.entity';

@Controller('quest')
export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) {}

    // 도전과제 조회
    @Get('daily')
    async getTopFiveChallenges(): Promise<Quest[]> {
        return this.challengeService.getTopFiveChallenges();
    }

    // 특정 카테고리별 
    @Get(':category')
    async getChallengeByCategory(@Param('category') category: string): Promise<Quest> {
        return this.challengeService.getChallengeByCategory(category);
    }

    // 도전과제 생성
    @Post()
    async createChallenge(@Body() challengeData: Partial<Quest>): Promise<Quest> {
        return this.challengeService.createChallenge(challengeData);
    }

    // 도전과제 삭제
    @Delete(':id')
    async deleteChallenge(@Param('id') id: number): Promise<void> {
        return this.challengeService.deleteChallenge(id);
    }
}
