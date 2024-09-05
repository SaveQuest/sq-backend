import { Matches } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RequestCodeDto {
    @ApiProperty({
        example: "01012345678",
        description: "인증번호를 전송할 전화번호"
    })
    @Matches(/^010\d{8}$/)
    phoneNumber: string
}
