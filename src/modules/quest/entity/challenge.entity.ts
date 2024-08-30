import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Exclude } from "class-transformer";

@Entity()
export class Challenge {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int')
    targetUsage: number;

    @Column()
    category: string;

    @Column()
    reward: string;

    @Column({ type: 'timestamptz' })
    deadline: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
