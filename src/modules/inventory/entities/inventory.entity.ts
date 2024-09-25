import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";
import { IsOptional } from "class-validator";

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  itemType: 'character' | 'pet' | 'tag'

  @Column()
  name: string

  @Column({nullable: true})
  content?: string

  @Column()
  @IsOptional()
  imageId?: string

  @Column({default: false})
  isEquipped: boolean
}