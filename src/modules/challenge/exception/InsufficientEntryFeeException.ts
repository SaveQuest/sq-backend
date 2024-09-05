// exceptions/challenge-not-found.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientEntryFeeException extends HttpException {
  constructor() {
    super('Insufficient_Amount', HttpStatus.BAD_REQUEST);
  }
}