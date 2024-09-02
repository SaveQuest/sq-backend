// exceptions/challenge-not-found.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFinishedChallengeException extends HttpException {
  constructor() {
    super('Not_Finished_Challenge_ID', HttpStatus.BAD_REQUEST);
  }
}