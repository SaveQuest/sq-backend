import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan, Like, Equal } from 'typeorm';
import { Product, ProductCategory } from "@/modules/shop/entity/product.entity";

import { ProductNotFoundException } from "@/modules/shop/exception/ProductNotFoundException";
import { InsufficientPointsException } from "@/modules/shop/exception/InsufficientPointsException";
import { User } from "@/modules/user/entities/user.entity";
import { StaticFileService } from "@/modules/staticfile/service/staticfile.service";
import { CreateProductDto } from "@/modules/shop/dto/createProduct.dto";
import { InventoryItem } from "@/modules/inventory/entities/inventory.entity";

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
    private readonly staticFileService: StaticFileService,
  ) {}

  async createProduct(userId: number, product: CreateProductDto): Promise<Record<string, any>> {
    const user = await this.userRepository.findOne({where: { id: userId }});
    if (!user.metadata.isAdmin) {
      throw new Error('관리자만 상품을 생성할 수 있습니다');
    }
    const productEntity = await this.productRepository.save(product);
    return {
      status: 'success', "product": productEntity,
    };
  }

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
  
 
  async purchaseProduct(userId: number, productId: number): Promise<Record<string, any>> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    console.log(product)

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

    if (product.category === 'randomBox') {
      return await this.openRandomBox(userId, product);
    }
    return { success: true, message: `${product.name} 구매 완료`};
  }

  async openRandomBox(userId: number, product: Product): Promise<Record<string, any>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    const totalProbability = product.randomBoxProbability.reduce((sum, p) => sum + Object.values(p)[0], 0);

    const randomValue = Math.random() * totalProbability;

    let cumulativeProbability = 0;
    for (const probability of product.randomBoxProbability) {
      const itemId = Object.keys(probability)[0];
      cumulativeProbability += probability[itemId];
      if (randomValue <= cumulativeProbability) {
        if (itemId === 'points') {
          const randomPoint = Math.floor(Math.random() * (2000 - 400 + 1)) + 400;
          user.points += randomPoint;
          await this.userRepository.save(user);
          return { item: { name: `포인트 ${randomPoint}`, image: 'point.png' }};
        }
        const item = await this.inventoryItemRepository.findOne({ where: { id: itemId } });
        user.inventory.push(item)
        if (!item) {
          throw new Error(`Item with id ${itemId} not found`);
        }
        return {
          item: {
            name: item.name,
            image: await this.staticFileService.StaticFile(userId, `product/${item.imageId}.png`),
          }
        };
      }
    }
  }
}
