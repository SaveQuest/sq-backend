// mileage.controller.ts
import { Controller, Get, Post, Body, Request } from "@nestjs/common";
import { MileageService } from '../service/mileage.service';
import { UsedAmountDto } from '../dto/usedAmount.dto';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IncomingMessage } from "http";


@Controller('mileage')
@ApiTags("결제내역 처리")
@ApiBearerAuth('accessToken') 
export class MileageController {
    constructor(
        private readonly mileageService: MileageService
    ) {}

    @Post('updateTransaction')
    async updateCardHistory(
      @Request() req: IncomingMessage,
      @Body() usedAmountDto: UsedAmountDto[]
    ) {
        console.log(usedAmountDto)
        return await this.mileageService.updateCardHistory(req.userId, usedAmountDto.reverse());
    }

    @Get('lastApprovalTime')
    async getLastApprovalTime(@Request() req: IncomingMessage) {
        return await this.mileageService.getLastApprovalTime(req.userId);
    }
}
