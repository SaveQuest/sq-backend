import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Exclude } from "class-transformer";

@Entity()
export class Quest {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int')
    totalUsage: number;

    @Column('int')
    limitUsage: number;

    @Column()
    discriminator: string;

    @Column()
    reward: number;

    @Column({ type: 'timestamptz' })
    deadline: Date;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @Column()
    status: 'inProgress' | 'completed' | 'failed';
}
