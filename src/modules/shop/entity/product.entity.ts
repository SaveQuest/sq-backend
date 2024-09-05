import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Review } from './review.entity';
import { Exclude } from "class-transformer";

@Entity()
export class Product {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({default: ''})
  description: string;

  @Column()
  imageId: string; // r2의 imageId

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  price: number;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

}
