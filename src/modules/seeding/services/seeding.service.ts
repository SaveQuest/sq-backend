import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SeedingLog } from "../entities/seedingLog.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { Challenge } from "@/modules/challenge/entity/challenge.entity";
import { Product } from "@/modules/shop/entity/product.entity";

@Injectable()
export class SeedingService implements OnApplicationBootstrap {
    constructor(
        private readonly entityManager: EntityManager,
        @InjectRepository(SeedingLog)
        private readonly seedingLogRepository: Repository<SeedingLog>,
        @InjectRepository(Challenge)
        private readonly challengeRepository: Repository<Challenge>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async seed() {
        await this.setupChallenge()
    }

    async setupChallenge() {
        const frankChallenge = [this.challengeRepository.create(
            {
                joinCode: '51001',
                name: "1주일 무지출 챌린지",
                entryFee: 1000,
                prize: 4500,
                isFinished: false,
                endDate: new Date('2024-10-25'),
                usage: {},
                topic: "category:게임",
                isPublic: true,
            }
        ),
        this.challengeRepository.create(
            {
                joinCode: '51002',
                name: "게임 현질 절약하기",
                entryFee: 300,
                prize: 6500,
                isFinished: false,
                endDate: new Date('2024-10-25'),
                usage: {},
                topic: "category:게임",
                isPublic: true,
            }
        ),
        ]
        for (const challenge of frankChallenge) {
            await this.challengeRepository.save(challenge)
        }
    }

    private check(logId: string) {
        return this.seedingLogRepository.exists({ where: { logId } })
    }

    private done(logId: string) {
        return this.seedingLogRepository.insert({ logId })
    }

    async onApplicationBootstrap() {
        await this.seed()
    }
}