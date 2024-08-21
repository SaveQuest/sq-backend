import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { SeedingLog } from "../entities/seedingLog.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class SeedingService implements OnApplicationBootstrap {
    constructor(
        private readonly entityManager: EntityManager,
        @InjectRepository(SeedingLog)
        private readonly seedingLogRepository: Repository<SeedingLog>
    ) {

    }

    async seed() {
        console.log("seeding")
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