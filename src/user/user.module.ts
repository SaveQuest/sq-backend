import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSerivce } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        UserSerivce
    ],
    exports: [
        UserSerivce
    ],
    controllers: [UserController]
})
export class UserModule {}
