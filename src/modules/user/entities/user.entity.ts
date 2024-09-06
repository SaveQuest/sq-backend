import { Challenge } from "@/modules/challenge/entity/challenge.entity";
import { Quest } from "@/modules/quest/entity/quest.entity";
import { Mileage } from "@/modules/mileage/entity/mileage.entity";
import { Exclude } from "class-transformer";
import { Column, ManyToMany, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserTag {
    WELCOME = 1 << 0,
    ADMIN = 1 << 1,
    TEST_TAG = 1 << 2,
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Challenge, challenge => challenge.participants)
    challenges: Challenge[];

    @ManyToMany(() => Quest)
    quests: Quest[];

    @ManyToMany(() => Quest)
    mileage: Mileage[];

    @Column({ default: 0 })
    dailyUsage: number

    @Column({ default: 0 })
    yesterdayUsage: number

    @Column({ default: 0 })
    exp: number

    @Column({ type:"int", default: 4000 })
    points: number

    @Column({ type: "int", default: 0 })
    tags: number

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