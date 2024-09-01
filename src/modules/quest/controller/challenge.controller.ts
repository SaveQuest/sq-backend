import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ChallengeService } from '../service/challenge.service';
import { Challenge } from '../entity/challenge.entity';

@Controller('challenges')
export class ChallengeController {
    constructor(private readonly challengeService: ChallengeService) {}

    // 도전과제 조회
    @Get('daily')
    async getTopFiveChallenges(): Promise<Challenge[]> {
        return this.challengeService.getTopFiveChallenges();
    }

    // 특정 카테고리별 
    @Get(':category')
    async getChallengeByCategory(@Param('category') category: string): Promise<Challenge> {
        return this.challengeService.getChallengeByCategory(category);
    }

    // 도전과제 생성
    @Post()
    async createChallenge(@Body() challengeData: Partial<Challenge>): Promise<Challenge> {
        return this.challengeService.createChallenge(challengeData);
    }

    // 도전과제 삭제
    @Delete(':id')
    async deleteChallenge(@Param('id') id: number): Promise<void> {
        return this.challengeService.deleteChallenge(id);
    }
}
