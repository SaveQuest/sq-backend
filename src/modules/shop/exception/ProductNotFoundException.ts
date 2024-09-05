import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor() {
    super('PRODUCT_NOT_FOUND', HttpStatus.BAD_REQUEST);
  }
}