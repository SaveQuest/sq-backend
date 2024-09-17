import { HttpException, HttpStatus } from "@nestjs/common";

export class UnsupportedCountryError extends HttpException {
  constructor() {
    super("UNSUPPORTED_COUNTRY_ERROR", HttpStatus.BAD_REQUEST)
  }
}
