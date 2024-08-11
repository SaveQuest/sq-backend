import { Body, Controller, Post } from '@nestjs/common';
import { isPublic } from '../decorators';
import { AuthService } from '../services/auth.service';
import { RequestCodeDto } from '../dto/request-code.dto';
import { AuthenticateDto } from '../dto/authenticate.dto';

@isPublic()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/requestCode")
    requestCode(@Body() requestCodeDto: RequestCodeDto) {
        return this.authService.requestCode(requestCodeDto)
    }

    @Post("/authenticate")
    authenticate(@Body() authenticateDto: AuthenticateDto) {
        return this.authService.authenticate(authenticateDto)
    }
}
