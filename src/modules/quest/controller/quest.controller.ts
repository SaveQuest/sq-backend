import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { QuestService } from '../service/quest.service';
import { Quest } from '../entity/quest.entity';

@Controller('challenges')
export class QuestController {
    constructor(private readonly challengeService: QuestService) {}

    // // 도전과제 조회
    // @Get('daily')
    // async getTopFiveChallen(): Promise<Quest[]> {
    //     return this.challengeService.getTopFiveChallenges();
    // }
    //
    // // 특정 카테고리별
    // @Get(':category')
    // async getChallengeByCategory(@Param('category') category: string): Promise<Quest> {
    //     return this.questService.getChallengeByCategory(category);
    // }
    //
    // // 도전과제 생성
    // @Post()
    // async createChallenge(@Body() challengeData: Partial<Challenge>): Promise<Quest> {
    //     return this.questService.createChallenge(challengeData);
    // }
    //
    // // 도전과제 삭제
    // @Delete(':id')
    // async deleteChallenge(@Param('id') id: number): Promise<void> {
    //     return this.questService.deleteChallenge(id);
    // }
}
