// challenge.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Challenge } from "../entity/challenge.entity";
import { User } from "@/modules/user/entities/user.entity";
import { MileageService } from "@/modules/mileage/service/mileage.serviece";

@Injectable()
export class ChallengeService {
    constructor(
        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mileageService: MileageService,
    ) { }

    // 참가자 추가 메서드
    async addParticipant(challengeId: number, userId: number): Promise<string> {
        const challenge = await this.challengeRepository.findOne({ where: { challengeId }, relations: ['participants'] });
        const user = await this.userRepository.findOne({ where: { userId } });

        if (!challenge || !user) {
            return "챌린지나 유저가 존재하지 않습니다.";
        }

        if (user.points < challenge.entryFee) {
            return "참가비 부족";
        }

        user.points -= challenge.entryFee; // 참가비 차감
        challenge.participants.push(user); // 참가자 추가

        await this.challengeRepository.save(challenge);
        await this.userRepository.save(user);

        return `${user.phoneNumber}님이 ${challenge.title}에 참가하였습니다.`;
    }

    // 챌린지 우승자 계산 메서드
    async calculateWinner(challengeId: number): Promise<string> {
        const challenge = await this.challengeRepository.findOne({ where: { challengeId }, relations: ['participants'] });
        if (!challenge) return '챌린지를 찾을 수 없습니다.';

        const now = new Date();
        if (now < challenge.endDate) return '챌린지가 아직 종료되지 않았습니다.';

        let winner: User | null = null;
        let minMileage: number | null = null;

        for (const participant of challenge.participants) {
            const totalMileage = await this.getUserTotalMileage(participant.userId); // 유저의 총 소비량 확인
            if (minMileage === null || totalMileage < minMileage) {
                minMileage = totalMileage;
                winner = participant;
            }
        }

        if (winner) {
            winner.points += challenge.prize; // 우승자에게 상금 지급
            await this.userRepository.save(winner);
            return `${winner.phoneNumber}님이 우승하였습니다! 상금 ${challenge.prize} 포인트를 획득하셨습니다.`;
        } else {
            return "참가자가 없습니다.";
        }
    }

    private async getUserTotalMileage(userId: number): Promise<number> {
        // MileageService의 메서드 호출
        return this.mileageService.getTotalMileageForUser(userId);
    }

    // 챌린지 추가 메서드
    async createChallenge(title: string, entryFee: number, prize: number, endDate: Date): Promise<Challenge> {
        const newChallenge = this.challengeRepository.create({
            title,
            entryFee,
            prize,
            endDate,
        });

        return await this.challengeRepository.save(newChallenge);
    }
}
