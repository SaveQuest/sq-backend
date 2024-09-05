// mileage.controller.ts
import { Controller, Get, Body } from '@nestjs/common';
import { MileageService } from '../service/mileage.serviece';
import { UsedAmountDto } from '../dto/usedAmount.dto';
import { ApiBearerAuth } from "@nestjs/swagger";

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
