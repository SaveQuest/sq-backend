import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from "class-transformer";

export type ProductCategory = 'character' | 'pet' | 'background' | 'randomBox'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  imageId: string;

  @Column()
  category: ProductCategory;

  @Column()
  isAvailable: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: {},
  })
  metadata?: Record<string, any>;

}
