import { Module } from '@nestjs/common';
import { SeedingService } from './services/seeding.service';
import { SeedingLog } from './entities/seedingLog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from '../challenge/entity/challenge.entity';
import { Product } from '../shop/entity/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SeedingLog, Challenge, Product])],
    providers: [SeedingService]
})
export class SeedingModule { }
