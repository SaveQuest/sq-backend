import { HttpException, HttpStatus } from "@nestjs/common";

export class InvalidPhoneNumberError extends HttpException {
  constructor() {
    super("INVALID_PHONE_NUMBER_ERROR", HttpStatus.BAD_REQUEST)
  }
}
