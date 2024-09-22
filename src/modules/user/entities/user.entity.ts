import { Challenge } from "@/modules/challenge/entity/challenge.entity";
import { Quest } from "@/modules/quest/entity/quest.entity";
import { Mileage } from "@/modules/mileage/entity/mileage.entity";
import { Notification } from "@/modules/notification/entities/notification.entity";
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

export enum UserTag {
    WELCOME = 1 << 0,
    ADMIN = 1 << 1,
    TEST_TAG = 1 << 2,
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: "홍길동"})
    name: string

    @ManyToOne(() => Challenge, challenge => challenge.participants)
    challenge: Challenge;

    @ManyToMany(() => Quest)
    @JoinTable()
    quests: Quest[];

    @ManyToMany(() => Mileage)
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

    @Column({ nullable: true})
    staticFileRequestKey: string

    getTags(): UserTag[] {
        const activeTags: UserTag[] = [];
        for (const tag in UserTag) {
            const tagValue = parseInt(tag, 10);
            if (!isNaN(tagValue) && (this.tags & tagValue) === tagValue) {
                activeTags.push(tagValue);
            }
        }
        return activeTags;
    }
    
    hasTag(tag: UserTag): boolean {
        return (this.tags & tag) === tag;
    }
  
    addTag(tag: UserTag) {
        this.tags |= tag;
    }

    removeTag(tag: UserTag) {
        this.tags &= ~tag;
    }

    @Column({ unique: true })
    phoneNumber: string

    @Exclude()
    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}