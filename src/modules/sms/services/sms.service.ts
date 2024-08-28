import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
    private readonly webhookUrl = 'https://discord.com/api/webhooks/1278364638098231347/f0ir83VfJV6IW_TSRGZTGHPQh0ZeAMZoeygYhfY6U6qwkZyd_Ncmk46BkcifVVP8qm_A'; // 디스코드 웹훅 URL을 여기에 입력

    async sendSMS(phoneNumber: string, message: string) {
        const discordMessage = {
            content: `Phone Number: ${phoneNumber}\nMessage: ${message}`,
        };

        try {
            await axios.post(this.webhookUrl, discordMessage);
        } catch (error) {
            console.error('Error sending message to Discord ', error);
        }
    }
}
