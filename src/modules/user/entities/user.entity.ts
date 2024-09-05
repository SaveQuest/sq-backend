import { Challenge } from "@/modules/challenge/entity/challenge.entity";
import { Quest } from "@/modules/quest/entity/quest.entity";
import { Exclude } from "class-transformer";
import { Column, ManyToMany, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToMany(() => Challenge, challenge => challenge.participants)
    challenges: Challenge[];

    // @ManyToMany(() => Quest, quest => quest.participants)
    // quests: Quest[];

    @Column({ default: 0 })
    exp: number

    @Column({ type:"int", default: 4000 })
    points: number

    @Column({ unique: true })
    phoneNumber: string

    @Exclude()
    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}