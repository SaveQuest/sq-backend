// quest.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Challenge } from "../entity/challenge.entity";
import { User } from "@/modules/user/entities/user.entity";
import { MileageService } from "@/modules/mileage/service/mileage.serviece";
import { FinishedChallengeService } from "@/modules/finished_challenge/service/finished_challengeservice";
import { FinishedChallenge } from "@/modules/finished_challenge/entity/finished_challenge.entity";

@Injectable()
export class ChallengeService {
    constructor(
        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mileageService: MileageService,
        private readonly finishedChallengeService: FinishedChallengeService,
    ) { }


    // 챌린지 목록 조회 메서드
    async getChallengeList(): Promise<any[]> {
        const challenges = await this.challengeRepository.find({ relations: ['participants'] });
        const challengeList = [];

        for (const challenge of challenges) {
            const participantCount = challenge.participants.length;

            challengeList.push({
                title: challenge.title,                     // 챌린지 제목
                participantCount: participantCount,        // 참가자 수
                prize: challenge.prize,                    // 상금
                endDate: challenge.endDate.toLocaleDateString(), // 종료 날짜
                entryFee: challenge.entryFee,              // 참가비
            });
        }

        return challengeList;
    }

    
    // 유저 본인이 참가 중인 챌린지 조회
    async getUserActiveChallenges(userId: number): Promise<Challenge[]> {
        return await this.challengeRepository
            .createQueryBuilder("challenge")
            .leftJoinAndSelect("challenge.participants", "participant")
            .where("participant.userId = :userId", { userId })
            .andWhere("challenge.endDate > NOW()") // 현재 진행 중인 챌린지 조건
            .getMany();
    }


    // 챌린지의 세부 정보 반환
    async getChallengeDetails(challengeId: number): Promise<any> {
        const challenge = await this.challengeRepository.findOne({ where: { id: challengeId } });
        if (!challenge) {
            throw new Error("챌린지를 찾을 수 없습니다.");
        }

        return {
            title: challenge.title,  // 챌린지 제목
            entryFee: challenge.entryFee,  // 참가비
            prize: challenge.prize,  // 상금
            endDate: challenge.endDate,  // 종료 날짜
        };
    }


    // 참가자 추가 메서드
    async addParticipant(challengeId: number, userId: number): Promise<string> {
        const challenge = await this.challengeRepository.findOne({ where: { id: challengeId }, relations: ['participants'] });
        const user = await this.userRepository.findOne({ where: { id: userId } });

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


    // 챌린지참가자 순위 반환
    async getParticipantRankings(challengeId: number): Promise<any[]> {
        const challenge = await this.challengeRepository.findOne({ where: { id: challengeId }, relations: ['participants'] });
        if (!challenge) {
            throw new Error("챌린지를 찾을 수 없습니다.");
        }

        // 참가자 목록 가져오기
        const rankings = [];
        for (const participant of challenge.participants) {
            const totalMileage = await this.mileageService.getTotalMileageForUser(participant.id); // 유저의 총 소비량 확인
            rankings.push({
                userId: participant.id,
                totalMileage: totalMileage, // 소비량
            });
        }

        // 소비량에 따라 오름차순 정렬
        rankings.sort((a, b) => a.totalMileage - b.totalMileage);

        return rankings;
    }


    // 챌린지 우승자 계산 메서드
    async calculateWinner(challengeId: number): Promise<string> {
        const challenge = await this.challengeRepository.findOne({ where: { id: challengeId }, relations: ['participants'] });
        if (!challenge) return '챌린지를 찾을 수 없습니다.';

        const now = new Date();
        if (now < challenge.endDate) return '챌린지가 아직 종료되지 않았습니다.';

        let winner: User | null = null;
        let minMileage: number | null = null;

        for (const participant of challenge.participants) {
            const totalMileage = await this.getUserTotalMileage(participant.id); // 유저의 총 소비량 확인
            if (minMileage === null || totalMileage < minMileage) {
                minMileage = totalMileage;
                winner = participant;
            }
        }

        if (winner) {
            winner.points += challenge.prize; // 우승자에게 상금 지급
            await this.userRepository.save(winner);
            return `${winner.id}`;
        } else {
            return null;
        }
    }


    // 총 사용량 집계 메서드
    private async getUserTotalMileage(userId: number): Promise<number> {
        // MileageService의 메서드 호출
        return this.mileageService.getTotalMileageForUser(userId);
    }


    // 챌린지 종료 및 완료된 챌린지로 이동
    async completeChallenge(challengeId: number): Promise<string> {
        const challenge = await this.challengeRepository.findOne({ where: { id: challengeId }, relations: ['participants'] });

        if (!challenge) {
            return '챌린지를 찾을 수 없습니다.';
        }

        const now = new Date();
        if (now < challenge.endDate) {
            return '챌린지가 아직 종료되지 않았습니다.';
        }

        // 우승자 계산 메서드 호출
        const winnerMessage = await this.calculateWinner(challengeId);

        if (winnerMessage.includes("우승자가 없습니다.") || winnerMessage.includes("찾을 수 없습니다.")) {
            return winnerMessage; // 우승자가 없을 때 메시지 반환
        }

        // 우승자 정보 가져오기
        const winner = await this.getWinner(challengeId);
        if (!winner) {
            return '우승자를 결정할 수 없습니다.';
        }

        // 완료된 챌린지 저장
        const finishedChallenge = new FinishedChallenge();
        finishedChallenge.title = challenge.title;
        finishedChallenge.entryFee = challenge.entryFee;
        finishedChallenge.prize = challenge.prize;
        finishedChallenge.endDate = challenge.endDate;
        finishedChallenge.participantCount = challenge.participants.length;
        finishedChallenge.winner = winner;

        await this.finishedChallengeService.addFinishedChallenge(finishedChallenge);

        // 기존 챌린지 삭제
        await this.challengeRepository.remove(challenge);

        return `${challenge.title} 챌린지가 완료되었습니다. ${winner.phoneNumber}님이 우승하셨습니다!`;
    }


    // 우승자를 가져오는 메서드 (calculateWinner 메서드에서 설정된 우승자 정보를 사용)
    private async getWinner(challengeId: number): Promise<User | null> {
        const challenge = await this.challengeRepository.findOne({ where: { id: challengeId }, relations: ['participants'] });
        if (!challenge) return null;

        let winner: User | null = null;
        let minMileage: number | null = null;

        for (const participant of challenge.participants) {
            const totalMileage = await this.getUserTotalMileage(participant.id);
            if (minMileage === null || totalMileage < minMileage) {
                minMileage = totalMileage;
                winner = participant;
            }
        }

        return winner;
    }
}
