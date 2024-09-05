import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientPointsException extends HttpException {
  constructor() {
    super('INSUFFICIENT_POINT', HttpStatus.BAD_REQUEST);
  }
}