import { Controller, Post, Get, Param, Body, Query, Request } from "@nestjs/common";
import { ShopService } from '@/modules/shop/service/shop.service';
import { Product, ProductCategory } from "@/modules/shop/entity/product.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IncomingMessage } from "http";
import { CreateProductDto } from "@/modules/shop/dto/createProduct.dto";

@Controller('store')
@ApiTags("상점")
@ApiBearerAuth("accessToken")
export class ShopController {
  constructor(
    private readonly productService: ShopService,
  ) {}

  @Post('create')
  async createProduct(
    @Body() product: CreateProductDto,
    @Request() req: IncomingMessage,
  ): Promise<any> {
    return await this.productService.createProduct(req.userId, product);
  }

  @Get('product')
  async getProductsByCategory(
    @Query('category') category: ProductCategory,
    @Request() req: IncomingMessage,
  ): Promise<any> {
    return await this.productService.getProductsByCategory(req.userId, category as ProductCategory);
  }

  @Get('product/:id')
  async getProductById(
    @Param('id') productId: number,
    @Request() req: IncomingMessage,
  ): Promise<any> {
    return await this.productService.getProductById(req.userId, productId);
  }

  @Post('product/:id/purchase')
  async purchaseProduct(
    @Request() req: IncomingMessage,
    @Param('id') productId: number,
  ): Promise<any> {
    return await this.productService.purchaseProduct(req.userId, productId);
  }
}