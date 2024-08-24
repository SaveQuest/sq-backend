import { Controller, Get, Request } from '@nestjs/common';
import { MileageService  } from '../service/mileage.serviece';
import { usedAmount } from 'http';

@Controller('mileage')
export class MileageController {
    constructor(
        private readonly mileageservice: MileageService
    ) {}

    @Get("stackMileage")
    async stackMileage(@Request() req: usedAmount) {
        return await this.mileageservice.insertMileageByUsers(req.userId, req.amount, req.content, req.date)
    }
}
