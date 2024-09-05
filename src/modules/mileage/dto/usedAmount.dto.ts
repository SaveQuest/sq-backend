// dto/used-amount.dto.ts
import { IsNumber, IsString, IsDate, IsOptional, IsEnum } from 'class-validator';

export enum CardIssuer {
    HANACARD = 'hanacard',
    KBCARD = 'kbcard',
    WORRICARD = 'worricard',
    BCCARD = 'bccard',
    LOTTECARD = 'lottecard',
    KAKAOMINI = 'kakaomini',
    TOSSUSS = 'tossuss'
}

export class UsedAmountDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    amount: number;

    @IsDate()
    date: Date;

    @IsEnum(CardIssuer)
    cardIssuer: CardIssuer;

    @IsNumber()
    approvalTime: number;

    @IsString()
    merchantName: string;

    @IsOptional()
    @IsString()
    approvalNumber?: string;

    @IsOptional()
    @IsString()
    merchantCategory?: string;

    @IsOptional()
    @IsString()
    merchantId?: string;

    @IsOptional()
    @IsString()
    merchantBusinessNumber?: string;
}