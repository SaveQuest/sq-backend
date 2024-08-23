import { Controller, Get, Request } from '@nestjs/common';
import { MileageService  } from '../service/mileage.serviece';
import { IncomingMessage } from 'http';

@Controller('mileage')
export class MileageController {
    constructor(
        private readonly mileageservice: MileageService
    ) {}

    @Get("stackMileage")
    async stackMileage(@Request() req: IncomingMessage) {
        return await this.mileageservice.insertMileageByUsers(req.userId)
    }
}
