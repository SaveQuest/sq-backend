import { Module } from '@nestjs/common';
import { SeedingService } from './services/seeding.service';
import { SeedingLog } from './entities/seedingLog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([SeedingLog])],
    providers: [SeedingService]
})
export class SeedingModule { }
