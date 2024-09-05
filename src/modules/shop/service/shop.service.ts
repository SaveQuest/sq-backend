import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '@/modules/shop/entity/product.entity';
import { Review } from '@/modules/shop/entity/review.entity';

import { ProductNotFoundException } from "@/modules/shop/exception/ProductNotFoundException";
import { InsufficientPointsException } from "@/modules/shop/exception/InsufficientPointsException";
import { User } from "@/modules/user/entities/user.entity";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // async createProduct(name: string, price: number, description: string): Promise<Product> {
  //   const product = this.productRepository.create({ name, price, description });
  //   return this.productRepository.save(product);
  // }

  async addReview(productId: number, content: string, rating: number): Promise<Review> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['reviews'],
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    const review = this.reviewRepository.create({ content, rating, product });
    return this.reviewRepository.save(review);
  }

  // 상품과 리뷰 목록 가져오기
  async getProductWithReviews(productId: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['reviews'],
    });
  }

  async getProductsByIds(ids: number[]): Promise<Product[]> {
    return this.productRepository.find({
      where: { id: In(ids) }, // In()을 사용하여 여러 ID 조건 전달
    });
  }

  async purchaseProducts(productIds: number[], userId: number): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

    if (!products.length) {
      throw new ProductNotFoundException();
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

    if (user.points < totalPrice) {
      throw new InsufficientPointsException();
    }

    user.points -= totalPrice;
    await this.userRepository.save(user);
    return products;
  }
}
