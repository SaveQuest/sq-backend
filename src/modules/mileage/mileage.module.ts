import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mileage } from './entity/mileage.entity';
import { MileageService } from './service/mileage.serviece';
import { MileageController } from './controller/mileage.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([mileage])
    ],
    providers: [
        MileageService
    ],
    exports: [
        MileageController
    ],
    controllers: [MileageController],
})
export class UserModule {}
