import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ProductService } from '@/modules/shop/service/shop.service';
import { Product } from '@/modules/shop/entity/product.entity';
import { Review } from '@/modules/shop/entity/review.entity';

@Controller('shop')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 특정 상품의 리뷰 추가
  @Post(':id/reviews')
  async addReview(
    @Param('id') productId: number,
    @Body('content') content: string,
    @Body('rating') rating: number,
  ): Promise<Review> {
    return this.productService.addReview(productId, content, rating);
  }

  // 특정 상품과 해당 상품의 리뷰 조회
  @Get(':id')
  async getProductWithReviews(@Param('id') productId: number): Promise<Product> {
    return this.productService.getProductWithReviews(productId);
  }
}
