import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { IncomingMessage } from 'http';

@Controller('user')
@ApiTags("사용자")
@ApiBearerAuth(
    "accessToken"
)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get("me")
    @ApiOperation({
        summary: "내 정보",
        description: "내 정보를 조회합니다. (로그인 필요)"
    })
    @ApiResponse({
        status: 200,
        description: "내 정보 조회 성공",
        content: {
            "application/json": {
                example: {
                    "id": 1,
                    "exp": 0,
                    "points": 0,
                    "phoneNumber": "01012345678"
                }
            }
        }
    })
    async me(@Request() req: IncomingMessage) {
        return await this.userService.findUserById(req.userId)
    }
}
