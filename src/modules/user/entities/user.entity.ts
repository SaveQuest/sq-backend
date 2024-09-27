import { Challenge } from "@/modules/challenge/entity/challenge.entity";
import { Quest } from "@/modules/quest/entity/quest.entity";
import { Mileage } from "@/modules/mileage/entity/mileage.entity";
import { Notification } from "@/modules/notification/entities/notification.entity";
import { InventoryItem } from "@/modules/inventory/entities/inventory.entity";
import { Exclude } from "class-transformer";
import {
    Column,
    ManyToMany,
    ManyToOne,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinTable
} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: "홍길동"})
    name: string

    @ManyToMany(() => Quest)
    @JoinTable()
    quests: Quest[];

    @ManyToMany(() => Quest)
    @JoinTable()
    generatedQuests: Quest[];

    @CreateDateColumn({ type: "timestamptz" , default: new Date(0)})
    lastQuestGeneratedAt: Date;

    @ManyToMany(() => Mileage)
    @JoinTable()
    mileage: Mileage[];

    @ManyToMany(() => Notification)
    notifications: Notification[];

    @Column({ default: 0 })
    dailyUsage: number

    @Column({ default: 0 })
    yesterdayUsage: number

    @Column({ default: 0 })
    exp: number

    @Column({ default: 1 })
    level: number

    @Column({ type:"int", default: 4000 })
    points: number

    @Column({ type: "int", default: 0 })
    tags: number

    @Column({ nullable: true })
    titleBadge: string

    @Column({ nullable: true })
    profileImageId: string

    @Column({ nullable: true})
    staticFileRequestKey: string

    @ManyToMany(() => InventoryItem)
    @JoinTable()
    inventory: InventoryItem[]

    @Column({ unique: true })
    phoneNumber: string

    @Exclude()
    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @Column({ default: 0 })
    totalSavedUsage: number

    @Column(
      {
          type: 'jsonb',
          default: {quest: 0, challenge: 0}
      }
    )
    totalEarned: {quest: number, challenge: number}

    @Column({type: 'jsonb', default: {
        isProfilePublic: false, isAdmin: false
    } })
    metadata: {
        isProfilePublic: boolean,
        isAdmin: boolean,
    }
}