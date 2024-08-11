import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestCodeDto } from '../dto/request-code.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { VerificationCode } from 'src/auth/entities/verification-code.entity';
import { SmsService } from 'src/sms/services/sms.service';
import { JwtService } from '@nestjs/jwt';
import { UserSerivce } from 'src/user/services/user.service';
import { InvalidVerificationCodeException } from '../exceptions/InvalidVerificationCodeException';
import { ExpiredVerificationCodeException } from '../exceptions/ExpiredVerificationCodeException';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserSerivce,
        private readonly smsService: SmsService,
        private readonly jwtService: JwtService,
        @InjectRepository(VerificationCode)
        private readonly verificationCodeRepository: Repository<VerificationCode>
    ) { }

    async requestCode({ phoneNumber }: RequestCodeDto) {
        const code = this.generateCode()
        const expiredAt = dayjs().add(30, "minutes").toDate()
        await this.sendVerificationCode(phoneNumber, code)

        const verificationCode = new VerificationCode()
        verificationCode.code = code
        verificationCode.phoneNumber = phoneNumber
        verificationCode.expiredAt = expiredAt
        await this.verificationCodeRepository.save(verificationCode)

        return { phoneNumber, expiredAt }
    }

    async authenticate({ phoneNumber, code }: AuthenticateDto) {
        const verificationCode = await this.verificationCodeRepository.findOne({
            where: {
                phoneNumber
            }
        })

        if (!verificationCode || verificationCode.code !== code) {
            throw new InvalidVerificationCodeException()
        }

        if(dayjs().isAfter(verificationCode.expiredAt)) {
            throw new ExpiredVerificationCodeException()
        }
        
        await this.verificationCodeRepository.remove(verificationCode)

        const user = await this.userService.getUserOrCreate(phoneNumber)
        const token = this.jwtService.sign({
            "userId": user.userId
        })

        return {
            "accessToken": token
        }
    }

    private async sendVerificationCode(phoneNumber: string, code: string) {
        const message = `SaveQuest 인증번호입니다.\n${code}`;
        await this.smsService.sendSMS(phoneNumber, message);
    }

    private generateCode() {
        const char = "0123456789"
        const res = []
        for (let i = 0; i < 6; i++) {
            res.push(char[Math.floor(char.length * Math.random())])
        }

        return res.join("")
    }
}
