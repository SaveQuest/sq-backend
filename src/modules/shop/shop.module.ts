import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './service/shop.service';
import { ShopController } from './controller/shop.controller';
import { Product } from './entity/product.entity';
import { User } from '@/modules/user/entities/user.entity';
import { StaticFileModule } from "@/modules/staticfile/staticfile.module";
import { InventoryItem } from "@/modules/inventory/entities/inventory.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, InventoryItem]),
    StaticFileModule,
  ],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
