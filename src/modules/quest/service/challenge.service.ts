import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../entity/challenge.entity';

@Injectable()
export class ChallengeService {
    constructor(
        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
    ) {}

    // 도전과제 조회
    async getTopFiveChallenges(): Promise<Challenge[]> {
        return this.challengeRepository.find({
            take: 5, // 상위 5개만 가져오기
            order: {
                createdAt: 'DESC', // 최신 도전과제부터 가져오기
            },
        });
    }

    // 특정 도전과제 조회
    async getChallengeByCategory(category: string): Promise<Challenge | undefined> {
        return this.challengeRepository.findOne({ where: { category } });
    }

    // 새로운 도전과제 생성
    async createChallenge(challengeData: Partial<Challenge>): Promise<Challenge> {
        const newChallenge = this.challengeRepository.create(challengeData);
        return this.challengeRepository.save(newChallenge);
    }

    // 도전과제 삭제
    async deleteChallenge(id: number): Promise<void> {
        await this.challengeRepository.delete(id);
    }
}
