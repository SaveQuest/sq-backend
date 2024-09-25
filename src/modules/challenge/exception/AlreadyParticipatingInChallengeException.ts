import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyParticipatingInChallengeException extends HttpException {
  constructor() {
    super('Already_Participating_In_Challenge', HttpStatus.BAD_REQUEST);
  }
}