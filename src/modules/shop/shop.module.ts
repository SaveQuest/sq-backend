import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopService } from './service/shop.service';
import { ShopController } from './controller/shop.controller';
import { Product } from './entity/product.entity';
import { Review } from './entity/review.entity';
import { User } from '@/modules/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review, User])],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
