import { Controller, Get, Request } from '@nestjs/common';
import { UserSerivce } from '../services/user.service';
import { IncomingMessage } from 'http';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserSerivce
    ) {}

    @Get("me")
    async me(@Request() req: IncomingMessage) {
        return await this.userService.findUserById(req.userId)
    }
}
