import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidVerificationCodeException extends HttpException {
    constructor() {
        super("INVALID_VERIFICATION_CODE", HttpStatus.BAD_REQUEST)
    }
}
