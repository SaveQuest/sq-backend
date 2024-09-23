import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan, Like, Equal } from 'typeorm';
import { Product, ProductCategory } from "@/modules/shop/entity/product.entity";

import { ProductNotFoundException } from "@/modules/shop/exception/ProductNotFoundException";
import { InsufficientPointsException } from "@/modules/shop/exception/InsufficientPointsException";
import { User } from "@/modules/user/entities/user.entity";
import { StaticFileService } from "@/modules/staticfile/service/staticfile.service";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly staticFileService: StaticFileService,
  ) {}


  // 카테고리별 조회
  // 우선 모든 상품 가져오게 해놓음
  async getProductsByCategory(userId: number, category: ProductCategory): Promise<Record<string, any>> {
    const products = await this.productRepository.find({
      where: {
        category,
      },
    });
    const result = products.map(async (product) => {
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: await this.staticFileService.StaticFile(userId, `storeProduct/${product.imageId}.png`),
      };
    });

    return {
      products: await Promise.all(result),
    }
  }

  async getProductById(userId: number, productId: number): Promise<Record<string, any>> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      image: await this.staticFileService.StaticFile(userId, `storeProduct/${product.imageId}.png`),
      description: product.description,
      isPurchasable: product.isAvailable,
    };
  }
  
 
  async purchaseProduct(productId: number, userId: number): Promise<Record<string, string>> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });


    if (user.points < product.price) {
      throw new InsufficientPointsException();
    }

    user.points -= product.price;
    await this.userRepository.save(user);
    return { message: `${product.name} 구매 완료`};
  }
}
