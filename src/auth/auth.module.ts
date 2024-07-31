import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { SmsModule } from 'src/sms/sms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationCode } from './entities/verification-code.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCode]),
    JwtModule.registerAsync({
      async useFactory(configService: ConfigService) {
        return {
          secret: configService.getOrThrow<string>("JWT_KEY")
        }
      },
      inject: [ConfigService]
    }),
    SmsModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: "APP_GUARD",
      useClass: AuthGuard,
    }
  ]
})
export class AuthModule { }
