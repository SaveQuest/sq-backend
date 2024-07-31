import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @Exclude()
    @PrimaryGeneratedColumn()
    userId: number

    @Column()
    exp: number

    @Column()
    points: number

    @Column()
    phoneNumber: string

    @Exclude()
    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @Exclude()
    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}