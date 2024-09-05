import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@/modules/shop/entity/product.entity';
import { Review } from '@/modules/shop/entity/review.entity';

import { ProductNotFoundException } from "@/modules/shop/exception/ProductNotFoundException";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
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
}
