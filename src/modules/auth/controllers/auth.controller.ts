import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Body, Controller, Post } from '@nestjs/common';
import { isPublic } from '../decorators';
import { AuthService } from '../services/auth.service';
import { RequestCodeDto } from '../dto/request-code.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';

@isPublic()
@Controller('auth')
@ApiTags("로그인")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/requestCode")
    @ApiOperation({
        summary: "인증번호 요청",
        description: "전화번호로 인증번호를 요청합니다.\n" +
          "인증번호는 6자리 숫자로 구성되며, 30분간 유효합니다."
    })
    @ApiResponse({
        status: 200,
        description: "인증번호 요청 성공",
        content: {
            "application/json": {
                example: {
                    "phoneNumber": "01012345678",
                    "uuid": "ac2acd11-fb5e-4cf6-b523-d9160bfcf0a8",
                    "expiredAt": "2021-08-01T00:00:00.000Z"
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: "전화번호 형식 오류"
    })
    requestCode(@Body() requestCodeDto: RequestCodeDto) {
        return this.authService.requestCode(requestCodeDto)
    }

    @Post("/authenticate")
    @ApiOperation({
        summary: "전화번호 인증",
        description: "인증번호를 입력하여 로그인합니다.\n" +
          "인증번호는 30분간 유효합니다.",
    })
    @ApiResponse({
        status: 200,
        description: "로그인 성공",
        content: {
            "application/json": {
                example: {
                    "accessToken": "eyJhbGci....", "newUser": true,
                }
            }
        }
    })
    authenticate(@Body() authenticateDto: AuthenticateDto) {
        return this.authService.authenticate(authenticateDto)
    }
}
