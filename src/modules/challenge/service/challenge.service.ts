// challenge.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Challenge } from "../entity/challenge.entity";
import { User } from "@/modules/user/entities/user.entity";
import { MileageService } from "@/modules/mileage/service/mileage.serviece";
import { NotFoundChallengesException } from "../exception/NotFoundChallengesException";
import { InsufficientEntryFeeException } from "../exception/InsufficientEntryFeeException";
import { NotFinishedChallengeException } from "../exception/NotFinishedChallengeException";
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

  async getChallengeList(): Promise<any[]> {
    const challenges = await this.challengeRepository.find({ relations: ['participants'] });
    return challenges.map(challenge => ({
      title: challenge.title,
      participantCount: challenge.participants.length,
      prize: challenge.prize,
      endDate: challenge.endDate.toLocaleDateString(),
      entryFee: challenge.entryFee,
    }));
  }

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
    return {
      title: challenge.title,
      entryFee: challenge.entryFee,
      prize: challenge.prize,
      endDate: challenge.endDate,
    };
  }

  async addParticipant(id: number, userId: number): Promise<any> {
    const challenge = await this.challengeRepository.findOne({ where: { id }, relations: ['participants'] });
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    if (user.points < challenge.entryFee) {
      throw new InsufficientEntryFeeException();
    }

    user.points -= challenge.entryFee;
    challenge.participants.push(user);

    await this.challengeRepository.save(challenge);
    await this.userRepository.save(user);

    return { message: `${user.phoneNumber}님이 ${challenge.title}에 참가하였습니다.` };
  }

  async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const { title, entryFee, prize, isFinished, endDate } = createChallengeDto;

    const newChallenge = this.challengeRepository.create({
      title,
      entryFee,
      prize,
      isFinished,
      endDate,
    });

    return await this.challengeRepository.save(newChallenge);
  }

  async getParticipantRankings(id: number): Promise<any[]> {
    const challenge = await this.challengeRepository.findOne({ where: { id }, relations: ['participants'] });
    if (!challenge) {
      throw new NotFoundChallengesException();
    }

    const rankings = [];
    for (const participant of challenge.participants) {
      const totalMileage = await this.mileageService.getTotalMileageForUser(participant.userId);
      rankings.push({
        userId: participant.userId,
        totalMileage: totalMileage,
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
      const totalMileage = await this.getUserTotalMileage(participant.userId);
      if (minMileage === null || totalMileage < minMileage) {
        minMileage = totalMileage;
        winner = participant;
      }
    }

    if (winner) {
      winner.points += challenge.prize;
      await this.userRepository.save(winner);
      return winner.userId.toString();
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
    const winner = await this.userRepository.findOne({ where: { userId: Number(winnerId) } });

    challenge.isFinished = true;
    await this.challengeRepository.save(challenge);

    return { message: `${challenge.title} 챌린지가 완료되었습니다. ${winner.phoneNumber}님이 우승하셨습니다!` };
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
