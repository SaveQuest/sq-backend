// exceptions/insufficient-amount.exception.ts
import { BadRequestException, HttpStatus } from '@nestjs/common';

export class InsufficientAmountException extends BadRequestException {
    constructor() {
        super('Insufficient_Amount');
    }
}