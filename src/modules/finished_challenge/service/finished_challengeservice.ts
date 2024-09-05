// finished-quest.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinishedChallenge } from '../entity/finished_challenge.entity';

@Injectable()
export class FinishedChallengeService {
    constructor(
        @InjectRepository(FinishedChallenge)
        private readonly finishedChallengeRepository: Repository<FinishedChallenge>,
    ) { }

    // 완료된 챌린지를 저장하는 메서드
    async addFinishedChallenge(finishedChallenge: FinishedChallenge): Promise<FinishedChallenge> {
        return await this.finishedChallengeRepository.save(finishedChallenge);
    }

     // 유저 본인이 참가했던 완료된 챌린지 조회
     async getUserFinishedChallenges(userId: number): Promise<FinishedChallenge[]> {
        return await this.finishedChallengeRepository
            .createQueryBuilder("finishedChallenge")
            .leftJoinAndSelect("finishedChallenge.participants", "participant")
            .where("participant.id = :userId", { userId })
            .getMany();
    }
}
