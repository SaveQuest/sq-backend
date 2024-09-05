import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateDto {
    @ApiProperty({
        example: "ac2acd11-fb5e-4cf6-b523-d9160bfcf0a8",
        description: "인증번호 전송 메세지를 보낼 때 생성된 세션 UUID"
    })
    @IsString()
    uuid: string

    @ApiProperty({
        example: "123456",
        description: "메세지로 전송된 인증번호"
    })
    @IsString()
    code: string
}
