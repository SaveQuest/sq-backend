import { IsMobilePhone } from "class-validator";

export class AuthenticateDto {
    @IsMobilePhone("ko-KR")
    phoneNumber: string

    code: string
}
