// mileage.controller.ts
import { Controller, Get, Post, Body, Request } from "@nestjs/common";
import { MileageService } from '../service/mileage.serviece';
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

    // 카드 거래내역 업데이트
    @Post('update')
    async updateCardHistory(
      @Request() req: IncomingMessage,
      @Body() usedAmountDto: UsedAmountDto[]
    ) {
        return await this.mileageService.updateCardHistory(req.userId, usedAmountDto);
    }

    // @Get('update')
    // async stackMileage(@Body() usedAmountDto: UsedAmountDto[]) {
    //     return await this.mileageService.insertMileageByUsers(usedAmountDto);
    // }
}
