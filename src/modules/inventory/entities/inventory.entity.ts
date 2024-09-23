import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

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

  @Column({nullable: true})
  imageUrl?: string

  @Column({default: false})
  isEquipped: boolean
}