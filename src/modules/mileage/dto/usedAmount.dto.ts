import { IsNumber, IsString, IsJSON } from 'class-validator';

interface Merchant {
    name: string;
    businessNumber: string;
    isForeign: boolean;
    id: string;
}

export class UsedAmountDto {
    @IsNumber()
    amount: number;

    @IsString()
    approvalNumber: string;

    @IsNumber()
    approvalTime: number;

    @IsString()
    cardIssuer: 'KB';

    @IsJSON()
    merchant: Merchant;
}