import { Controller, Get, Body } from '@nestjs/common';
import { MileageService  } from '../service/mileage.serviece';
import { usedAmount } from 'http';


@Controller('mileage')
export class MileageController {
    constructor(
        private readonly mileageService: MileageService
    ) {}

    @Get('update')
    async stackMileage(@Body() cardHistory: CardHistory[]) {
        // return await this.mileageService.insertMileageByUsers(
        //     userId,
        //     amount,
        //     date,
        //     cardIssuer,
        //     approvalTime,
        //     merchantName,
        //     approvalNumber,
        //     merchantCategory,
        //     merchantId,
        //     merchantBusinessNumber
        // );
    }
}
