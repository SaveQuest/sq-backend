import { Controller, Get, Request } from '@nestjs/common';
import { MileageService  } from '../service/mileage.serviece';
import { usedAmount } from 'http';


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
export class MileageController {
    constructor(
        private readonly mileageService: MileageService
    ) {}

    @Get('stackMileage')
    async stackMileage(@Request() req: { body: UsedAmount }) {
        const {
            userId,
            amount,
            date,
            cardIssuer,
            approvalTime,
            merchantName,
            approvalNumber,
            merchantCategory,
            merchantId,
            merchantBusinessNumber,
        } = req.body;

        return await this.mileageService.insertMileageByUsers(
            userId,
            amount,
            date,
            cardIssuer,
            approvalTime,
            merchantName,
            approvalNumber,
            merchantCategory,
            merchantId,
            merchantBusinessNumber
        );
    }
}
