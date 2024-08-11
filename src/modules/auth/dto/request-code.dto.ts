import { Matches } from "class-validator";

export class RequestCodeDto {
    @Matches(/^010\d{8}$/)
    phoneNumber: string
}
