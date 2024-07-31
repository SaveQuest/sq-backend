import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
    async sendSMS(phoneNumber: string, message: string) {
        console.log(message);
    }
}
