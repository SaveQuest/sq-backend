import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Challenge } from "../entity/challenge.entity";
import { User } from "@/modules/user/entities/user.entity";
import { MileageService } from "@/modules/mileage/service/mileage.service";
import { NotFoundChallengesException } from "../exception/NotFoundChallengesException";
import { InsufficientEntryFeeException } from "../exception/InsufficientEntryFeeException";
import { NotFinishedChallengeException } from "../exception/NotFinishedChallengeException";
import { AlreadyParticipatingInChallengeException } from "@/modules/challenge/exception/AlreadyParticipatingInChallengeException";
import { CreateChallengeDto } from '../dto/CreateChallenge.dto';
import { TasksSchedulerService } from "@/modules/challenge/service/task.service";

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly taskSchedulerService: TasksSchedulerService,
  ) {}

  async createChallenge(userId: number, createChallengeDto: CreateChallengeDto): Promise<{
    success: boolean;
    id: string;
    message?: string
  }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user.metadata.isAdmin === false) {
      return { id: "", success: false, message: 'Permission denied.'}
    }

    const challenge = this.challengeRepository.create({
      name: createChallengeDto.name,
      entryFee: createChallengeDto.entryFee,
      prize: createChallengeDto.prize,
      endDate: createChallengeDto.endDate,
      isFinished: false,
      usage: {},
      topic: createChallengeDto.topic,
    });
    await this.challengeRepository.save(challenge);
    await this.taskSchedulerService.registerNewTask(
      'Challenge Finish Task',
      challenge.id, challenge.endDate
    )
    return {success: true, id: challenge.id};
  }

  async getChallengeList(userId: number): Promise<any> {
    const challenges = await this.challengeRepository.find();
    return challenges.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      people: Object.keys(challenge.usage).length,
      totalReward: challenge.prize,
      endsAt: challenge.endDate.toLocaleDateString(),
      entryFee: challenge.entryFee,
      joined: Object.keys(challenge.usage).includes(userId.toString()),
    }));
  }

  async getJoinedChallenge(userId: number): Promise<Challenge> {
    const challenges = await this.challengeRepository.createQueryBuilder("challenge")
      .where(`challenge.usage ? :key`, { key: userId.toString() })
      .getMany();
    return challenges[0];
  }

  async getChallengeRanking(id: string): Promise<Record<string, string>[]> {
    const challenge = await this.challengeRepository.findOne({ where: { id } });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    const rankings = [];
    let rank = 1;
    const sortedUsageEntries = Object.entries(challenge.usage)
      .sort(([, usageA], [, usageB]) => usageA - usageB);
    for (const [participantId, usage] of sortedUsageEntries) {
      const user = await this.userRepository.findOne({ where: { id: Number(participantId) } });
      rankings.push({
        rank: rank++,
        name: user.name,
        level: user.level.toString(),
        element: [
          {
            "name": "지금까지 사용한 금액",
            "amount": '₩ ' + usage.toLocaleString('ko-KR'),
          }
        ]
      });
    }
    return rankings;
  }

  async getDst(userId: number): Promise<any> {
    const joinedChallenge = await this.getJoinedChallenge(userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const ranking = await this.getChallengeRanking(joinedChallenge.id)
      .then((rankings) => {rankings.slice(0, 2)});
    console.log(joinedChallenge)
    if (joinedChallenge == undefined) {
      return { message: "참가중인 챌린지가 없습니다." };
    }

    const questInfoUIBottom = {
      type: "LIST_ROW",
      content: [
        {
          "type": "QUEST_DATA_CARD",
          "content": {
            "topRowText": "챌린지 사용 금액",
            "bottomRowText": `₩ ${joinedChallenge.usage[userId.toString()].toLocaleString('ko-KR')}`,
          }
        },
        {
          "type": "QUEST_DATA_CARD",
          "content": {
            "topRowText": "지금까지 줄인 소비 금액",
            "bottomRowText": `₩ ${user.totalSavedUsage.toLocaleString('ko-KR')}`,
          }
        },
      ]
    }
    const questInfoUI = {
      type: "QUEST_INFO_CARD",
      content: {
        topRowText: joinedChallenge.name,
        bottomRowText: joinedChallenge.endDate.toLocaleDateString('ko-KR', {
          month: 'long',
          day: 'numeric'
        }),
      },
      bottom: questInfoUIBottom,
    }
    return {
      id: userId,
      element: {
        questInfo: questInfoUI,
        ranking: ranking,
      }
    }
  }

  async getChallengeDetails(id: string): Promise<any> {
    const challenge = await this.challengeRepository.findOne({ where: { id } });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }
    const ranking = await this.getChallengeRanking(challenge.id)
      .then((rankings) => {rankings.slice(0, 2)});

    return {
      id: challenge.id,
      name: challenge.name,
      endsAt: challenge.endDate,
      ranking: ranking,
      people: Object.keys(challenge.usage).length,
      totalReward: challenge.prize,
    }
  }

  async getChallengeRankings(challengeId: string): Promise<Record<string, any[]>> {
    const ranking = await this.getChallengeRanking(challengeId);
    return { ranking };
  }

  async joinChallenge(challengeId: string, userId: number): Promise<{ success: boolean; id: string }> {
    const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }
    if (challenge.isFinished) {
      throw new NotFinishedChallengeException();
    }
    if (challenge.usage[userId.toString()]) {
      throw new AlreadyParticipatingInChallengeException();
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user.points < challenge.entryFee) {
      throw new InsufficientEntryFeeException();
    }
    user.points -= challenge.entryFee;
    challenge.usage[userId.toString()] = 0;
    await this.challengeRepository.save(challenge);
    await this.userRepository.save(user);
    return {
      success: true,
      id: challengeId,
    };
  }
}
