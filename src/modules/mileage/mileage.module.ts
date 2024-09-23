import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mileage } from './entity/mileage.entity';
import { MileageService } from './service/mileage.service';
import { MileageController } from './controller/mileage.controller';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Mileage]), UserModule,],
    controllers: [MileageController],  // 컨트롤러 추가
    providers: [MileageService],       // 서비스 추가
    exports: [MileageService],         // 다른 모듈에서 사용할 서비스만 export
  })
  export class MileageModule {}
