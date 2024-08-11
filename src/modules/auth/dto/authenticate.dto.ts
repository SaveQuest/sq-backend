import { IsString } from "class-validator";

export class AuthenticateDto {
    @IsString()
    token: string

    @IsString()
    code: string
}
