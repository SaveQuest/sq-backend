import { HttpException, HttpStatus } from "@nestjs/common";

export class ExpiredVerificationCodeException extends HttpException {
    constructor() {
        super("EXPIRED_VERIFICATION_CODE", HttpStatus.BAD_REQUEST)
    }
}
