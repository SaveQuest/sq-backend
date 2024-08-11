import { IsMobilePhone } from "class-validator";

export class RequestCodeDto {
    @IsMobilePhone("ko-KR")
    phoneNumber: string
}
