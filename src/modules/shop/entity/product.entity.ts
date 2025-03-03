import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type ProductCategory = 'character' | 'pet' | 'randomBox'

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
  previewImageId: string;

  @Column()
  sourceImageId: string;

  @Column()
  category: ProductCategory;

  @Column()
  isAvailable: boolean;

  @Column({type: 'json', nullable: true})
  randomBoxProbability?: Record<string, number>[]

  @Column({
    type: 'jsonb',
    nullable: true,
    default: {},
  })
  metadata?: Record<string, any>;
}
