import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestCodeDto } from '../dto/request-code.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';
import { JwtService } from '@nestjs/jwt';
import { VerificationCode } from '@/modules/auth/entities/verification-code.entity';
import { SmsService } from '@/modules/sms/services/sms.service';
import { UserSerivce } from '@/modules/user/services/user.service';
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
        const token = crypto.randomUUID()

        await this.sendVerificationCode(phoneNumber, code)
        await this.saveVerificationCode(phoneNumber, code, token, expiredAt)

        return { phoneNumber, token, expiredAt }
    }

    async authenticate({ token, code }: AuthenticateDto) {
        const verificationCode = await this.verifyCode(token, code);
        await this.verificationCodeRepository.remove(verificationCode)

        const user = await this.userService.getUserOrCreate(token)
        const accessToken = this.generateToken(user.userId)

        return { accessToken }
    }

    private async sendVerificationCode(phoneNumber: string, code: string) {
        const message = `SaveQuest 인증번호입니다.\n${code}`
        await this.smsService.sendSMS(phoneNumber, message)
    }

    private async verifyCode(token: string, code: string): Promise<VerificationCode> {
        const verificationCode = await this.verificationCodeRepository.findOne({
            where: { token }
        });

        if (!verificationCode || verificationCode.code !== code) {
            throw new InvalidVerificationCodeException();
        }

        if (dayjs().isAfter(verificationCode.expiredAt)) {
            throw new ExpiredVerificationCodeException();
        }

        return verificationCode;
    }

    private generateToken(userId: number): string {
        return this.jwtService.sign({ userId });
    }

    private async saveVerificationCode(phoneNumber: string, code: string, token: string, expiredAt: Date): Promise<void> {
        await this.verificationCodeRepository.save({
            code, phoneNumber, token, expiredAt
        });
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