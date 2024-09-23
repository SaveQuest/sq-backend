import { Controller, Post, Get, Param, Body, Query, Request } from "@nestjs/common";
import { ShopService } from '@/modules/shop/service/shop.service';
import { Product, ProductCategory } from "@/modules/shop/entity/product.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IncomingMessage } from "http";

@Controller('store')
@ApiTags("상점")
@ApiBearerAuth("accessToken")
export class ShopController {
  constructor(
    private readonly productService: ShopService,
  ) {}

  @Get('product/:id')
  async getProductsByCategory(
    @Query('category') category: string,
    @Request() req: IncomingMessage,
    @Param('id') productId?: number,
  ): Promise<any> {
    if (!productId) {
      return await this.productService.getProductsByCategory(req.userId, category as ProductCategory);
    } else {
      return await this.productService.getProductById(req.userId, productId);
    }
  }

  @Post('product/:id/purchase')
  async purchaseProduct(
    @Request() req: IncomingMessage,
    @Param('id') productId: number,
  ): Promise<any> {
    return await this.productService.purchaseProduct(req.userId, productId);
  }
}