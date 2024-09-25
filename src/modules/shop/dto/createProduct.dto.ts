import { ProductCategory } from "@/modules/shop/entity/product.entity";
import { IsString, IsNumber, IsJSON, IsBoolean, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsString()
    imageId: string;

    @IsString()
    category: ProductCategory;

    @IsBoolean()
    isAvailable: boolean;

    @IsJSON()
    @IsOptional()
    metadata?: Record<string, any>;
}