// mileage.controller.ts
import { Controller, Get, Body } from '@nestjs/common';
import { MileageService } from '../service/mileage.serviece';
import { UsedAmountDto } from '../dto/usedAmount.dto';
import { ApiBearerAuth } from "@nestjs/swagger";


interface UsedAmount {
    userId: number;
    amount: number;
    date: Date;
    cardIssuer: 'hanacard' | 'kbcard' | 'worricard' | 'bccard' | 'lottecard' | 'kakaomini' | 'tossuss';
    approvalTime: number;
    merchantName: string;
    approvalNumber?: string;
    merchantCategory?: string;
    merchantId?: string;
    merchantBusinessNumber?: string;
}


@Controller('mileage')
@ApiBearerAuth('accessToken') 
export class MileageController {
    constructor(
        private readonly mileageService: MileageService
    ) {}

    @Get('stackMileage')
    async stackMileage(@Body() usedAmountDto: UsedAmountDto) {
        return await this.mileageService.insertMileageByUsers(usedAmountDto);
    }
}
