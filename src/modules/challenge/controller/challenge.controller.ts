// challenge.controller.ts
import { Controller, Post, Param, Get, Body } from "@nestjs/common";
import { ChallengeService } from "../service/challenge.service";
import { Challenge } from "../entity/challenge.entity";
import { CreateChallengeDto } from '../dto/CreateChallenge.dto';
import { JoinChallengeDto } from '../dto/JoinChallenge.dto';

@Controller('challenges')
export class ChallengeController {
  constructor(
    private readonly challengeService: ChallengeService,
  ) { }

  @Get('/')
  async getChallengeList() {
    return await this.challengeService.getChallengeList();
  }

  @Get('active/:userId')
  async getUserActiveChallenges(@Param('userId') userId: number) {
    return await this.challengeService.getUserActiveChallenges(userId);
  }

  @Get(':id/details')
  async getChallengeDetails(@Param('id') challengeId: number): Promise<any> {
    return this.challengeService.getChallengeDetails(challengeId);
  }

  @Post('create')
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    return this.challengeService.createChallenge(createChallengeDto);
  }

  @Post(':id/join')
  async joinChallenge(
    @Param('id') challengeId: number,
    @Body() joinChallengeDto: JoinChallengeDto,
  ): Promise<string> {
    const { userId } = joinChallengeDto;
    return this.challengeService.addParticipant(challengeId, userId);
  }

  @Get(':id/rankings')
  async getChallengeRankings(@Param('id') challengeId: number): Promise<any[]> {
    return this.challengeService.getParticipantRankings(challengeId);
  }

  @Post('complete/:id')
  async completeChallenge(@Param('id') challengeId: number) {
    return await this.challengeService.completeChallenge(challengeId);
  }

  @Get('finished/:userId')
  async getUserFinishedChallenges(@Param('userId') userId: number) {
    return await this.challengeService.getUserFinishedChallenges(userId);
  }
}
