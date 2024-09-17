import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { envSchema } from '@/config/env.validator';
import parsePhoneNumber from 'libphonenumber-js'
import { InvalidPhoneNumberError } from "@/modules/auth/exceptions/InvalidPhoneNumberError";
import { UnsupportedCountryError } from "@/modules/auth/exceptions/UnsupportedCountryError";
import { MessageSendFailureError } from "@/modules/auth/exceptions/MessageSendFailureError";

dotenv.config();
const env = envSchema.parse(process.env)


@Injectable()
export class SmsService {
    private readonly webhookUrl = 'https://discord.com/api/webhooks/1278366685992325284/K2YADRPqsdAv0TU-NEEcmALBVfiIr8zG_vOQGtZxLvYsERlT3CH53_ZYSEzNFfponD9P';
    private readonly smsApiUrl = 'https://rest.nexmo.com/sms/json';

    async sendSMS(phoneNumber: string, message: string) {
        if (env.NODE_ENV === 'development') {
            const discordMessage = {
                content: `Phone Number: ${phoneNumber}\nMessage: ${message}`,
            };

            try {
                await axios.post(this.webhookUrl, discordMessage);
            } catch (error) {
                console.error('Error sending message to Discord ', error);
            }
        } else if (env.NODE_ENV === 'production') {
            const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
            if (!parsedPhoneNumber.isValid()) {
                throw new InvalidPhoneNumberError();
            } else if (parsedPhoneNumber.country !== 'KR') {
                throw new UnsupportedCountryError();
            } else {
                try {
                    await axios.post(this.smsApiUrl, {
                        api_key: env.SMS_API_KEY,
                        api_secret: env.SMS_API_SECRET,
                        from: 'Vonage APIs',
                        to: parsedPhoneNumber.format('E.164'),
                        text: message,
                    });
                } catch (error) {
                    console.error('Error sending SMS ' + parsedPhoneNumber.formatInternational(), error);
                    throw new MessageSendFailureError();
                }
            }
        }
    }
}
