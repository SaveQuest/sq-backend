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
    ) {}

    async seed() {
        
    }

    async setupChallenge() {
        
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