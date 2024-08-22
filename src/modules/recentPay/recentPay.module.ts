import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { challenge } from './entities/recentPay.entity';
import { recentPaySerivce } from './services/recentPay.service';
import { recentPayController } from './controllers/recentPay.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([challenge]),
    ],
    providers: [
        recentPaySerivce
    ],
    exports: [
        recentPaySerivce
    ],
    controllers: [recentPayController]
})
export class recentPayModule {}
