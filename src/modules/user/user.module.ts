import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { StaticFileModule } from "@/modules/staticfile/staticfile.module";
import { InventoryItem } from "@/modules/inventory/entities/inventory.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, InventoryItem]),
        StaticFileModule,
    ],
    providers: [
        UserService
    ],
    exports: [
        UserService, TypeOrmModule
    ],
    controllers: [UserController],
})
export class UserModule {}
