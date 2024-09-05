// exceptions/challenge-not-found.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundChallengesException extends HttpException {
  constructor() {
    super('Not_Found_Challenge_ID', HttpStatus.NOT_FOUND);
  }
}