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

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mileageService: MileageService,
  ) {}

  async getChallengeList(userId: number): Promise<any[]> {
    const challenges = await this.challengeRepository.find({ relations: ['participants'] });
    return challenges.map(challenge => ({
      id: challenge.id,
      name: challenge.name,
      people: challenge.participants.length,
      totalReward: challenge.prize,
      endsAt: challenge.endDate.toLocaleDateString(),
      entryFee: challenge.entryFee,
      joined: challenge.participants.some(participant => participant.id === userId),
    }));
  }

  // 참가중인 챌린지 조회
  async getUserActiveChallenges(userId: number): Promise<Challenge[]> {
    return await this.challengeRepository
      .createQueryBuilder("challenge")
      .leftJoinAndSelect("challenge.participants", "participant")
      .where("participant.userId = :userId", { userId })
      .andWhere("challenge.endDate > NOW()")
      .getMany();
  }

  async getChallengeDetails(id: number): Promise<any> {
    const challenge = await this.challengeRepository.findOne({ where: { id } });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    const rankings = [];
    for (const participant of challenge.participants) {
      const totalMileage = await this.mileageService.getTotalMileageForUser(participant.id);
      const user = await this.userRepository.findOne({ where: { id: participant.id } });
      rankings.push({
        name: user.name,
        level: user.level.toString(),
        element: [
          {
            "name": "지금까지 사용한 금액",
            "amount": totalMileage,
          }
        ]
      });
    }
    rankings.sort((a, b) => a.totalMileage - b.totalMileage);
    rankings.slice(0, 2);

    return {
      id: challenge.id,
      endsAt: challenge.endDate,
      ranking: rankings,
      people: challenge.participants.length,
      totalReward: challenge.prize,
    }
  }

  async addParticipant(id: number, userId: number): Promise<any> {
    const challenge = await this.challengeRepository.findOne({ where: { id }, relations: ['participants'] });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    if (challenge.participants.some(participant => participant.id === userId)) {
      throw new AlreadyParticipatingInChallengeException();
    }

    if (user.points <= challenge.entryFee) {
      throw new InsufficientEntryFeeException();
    }

    user.points -= challenge.entryFee;
    challenge.participants.push(user);

    await this.challengeRepository.save(challenge);
    await this.userRepository.save(user);

    return { message: `${user.phoneNumber}님이 ${challenge.name}에 참가하였습니다.` };
  }


  async getParticipantRankings(id: number): Promise<any[]> {
    const challenge = await this.challengeRepository.findOne({ where: { id }, relations: ['participants'] });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    const rankings = [];
    for (const participant of challenge.participants) {
      const totalMileage = await this.mileageService.getTotalMileageForUser(participant.id);
      const user = await this.userRepository.findOne({ where: { id: participant.id } });
      rankings.push({
        name: user.name,
        level: user.level.toString(),
        element: [
          {
            "name": "지금까지 사용한 금액",
            "amount": totalMileage,
          }
        ]
      });
    }

    rankings.sort((a, b) => a.totalMileage - b.totalMileage);
    return rankings;
  }

  async calculateWinner(id: number): Promise<string> {
    const challenge = await this.challengeRepository.findOne({ where: { id }, relations: ['participants'] });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    const now = new Date();
    if (now < challenge.endDate) {
      throw new NotFinishedChallengeException();
    }

    let winner: User | null = null;
    let minMileage: number | null = null;

    for (const participant of challenge.participants) {
      const totalMileage = await this.getUserTotalMileage(participant.id);
      if (minMileage === null || totalMileage < minMileage) {
        minMileage = totalMileage;
        winner = participant;
      }
    }

    if (winner) {
      winner.points += challenge.prize;
      await this.userRepository.save(winner);
      return winner.id.toString();
    }
  }

  private async getUserTotalMileage(userId: number): Promise<number> {
    return this.mileageService.getTotalMileageForUser(userId);
  }

  async completeChallenge(id: number): Promise<any> {
    const challenge = await this.challengeRepository.findOne({ where: { id }, relations: ['participants'] });

    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    const now = new Date();
    if (now < challenge.endDate) {
      throw new NotFinishedChallengeException();
    }

    const winnerId = await this.calculateWinner(id);

    if (isNaN(parseInt(winnerId))) {
      throw new Error('Invalid winner ID');
    }

    const winner = await this.userRepository.findOne({ where: { id: parseInt(winnerId) } });

    if (!winner) {
      throw new Error('Winner not found');
    }

    challenge.isFinished = true;
    await this.challengeRepository.save(challenge);

    return { message: `${challenge.name} 챌린지가 완료되었습니다. ${winner.phoneNumber}님이 우승하셨습니다!` };
}


  async getUserFinishedChallenges(userId: number): Promise<Challenge[]> {
    return await this.challengeRepository
      .createQueryBuilder("challenge")
      .leftJoinAndSelect("challenge.participants", "participant")
      .where("participant.userId = :userId", { userId })
      .andWhere("challenge.isFinished = :isFinished", { isFinished: true })
      .getMany();
  }
}
