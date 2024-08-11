import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @Exclude()
    @PrimaryGeneratedColumn()
    userId: number

    @Column({ default: 0 })
    exp: number

    @Column({ default: 0 })
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