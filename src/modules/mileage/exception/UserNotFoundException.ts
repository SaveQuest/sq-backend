// exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
    constructor(userId: number) {
        super(`Unexpected_USER_ID_${userId}`);
    }
}