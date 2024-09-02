import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mileage } from './entity/mileage.entity';
import { MileageService } from './service/mileage.serviece';
import { MileageController } from './controller/mileage.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Mileage])
    ],
    providers: [
        MileageService
    ],
    exports: [
        MileageController
    ],
    controllers: [MileageController],
})
export class MileageModule {}
