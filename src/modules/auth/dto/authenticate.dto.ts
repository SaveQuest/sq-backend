import { IsString } from "class-validator";

export class AuthenticateDto {
    @IsString()
    uuid: string

    @IsString()
    code: string
}
