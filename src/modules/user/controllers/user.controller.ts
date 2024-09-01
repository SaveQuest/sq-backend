import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IncomingMessage } from 'http';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("me")
    async me(@Request() req: IncomingMessage) {
        return await this.userService.findUserById(req.userId)
    }
}
