import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ShopService } from '@/modules/shop/service/shop.service';
import { Product } from '@/modules/shop/entity/product.entity';
import { Review } from '@/modules/shop/entity/review.entity';

@Controller('shop')
export class ShopController {
  constructor(private readonly productService: ShopService) {}

  @Post(':id/reviews')
  async addReview(
    @Param('id') productId: number,
    @Body('content') content: string,
    @Body('rating') rating: number,
  ): Promise<Review> {
    return this.productService.addReview(productId, content, rating);
  }

  @Get(':id/reviews')
  async getProductWithReviews(@Param('id') productId: number): Promise<Product> {
    return this.productService.getProductWithReviews(productId);
  }

  @Get('/products')
  async getProductsByIds(@Query('ids') ids: string): Promise<Product[]> {
    const idArray = ids.split(',').map(Number);
    return this.productService.getProductsByIds(idArray);
  }

  @Post('purchase')
  async purchaseProducts(
    @Body('productIds') productIds: number[],
    @Body('userId') userId: number,
  ): Promise<Product[]> {
    return this.productService.purchaseProducts(productIds, userId);
  }
}
