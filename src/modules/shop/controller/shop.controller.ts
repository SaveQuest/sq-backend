import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ShopService } from '@/modules/shop/service/shop.service';
import { Product } from '@/modules/shop/entity/product.entity';
import { Review } from '@/modules/shop/entity/review.entity';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('shop')
@ApiTags("상점")
@ApiBearerAuth("accessToken")
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

   // 제목으로 상품 검색
   @Get('search')
   async searchProductsByTitle(@Query('title') title: string): Promise<Product[]> {
     return this.productService.searchProductsByTitle(title);
   }
 
   // 가격이 정확히 일치하는 상품 조회
   @Get('price')
   async getProductsByPrice(@Query('price') price: number): Promise<Product[]> {
     return this.productService.getProductsByPrice(price);
   }
 
   // 리뷰의 평균 rating이 특정 값과 일치하는 상품 조회
   @Get('rating')
   async getProductsByRating(@Query('rating') rating: number): Promise<Product[]> {
     return this.productService.getProductsByRating(rating);
   }
}
