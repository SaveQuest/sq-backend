import { HttpException, HttpStatus } from "@nestjs/common";

export class MessageSendFailureError extends HttpException {
  constructor() {
    super("MESSAGE_SEND_FAILURE_ERROR", HttpStatus.BAD_REQUEST)
  }
}
