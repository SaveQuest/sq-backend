// finished-quest.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from "@/modules/user/entities/user.entity";

@Entity()
export class FinishedChallenge {
    @PrimaryGeneratedColumn()
    id: number;

    // 챌린지 제목
    @Column()
    title: string;

    // 챌린지 참가비
    @Column()
    entryFee: number;

    // 우승 상금
    @Column()
    prize: number;

    // 챌린지 종료 날짜
    @Column({ type: 'timestamptz' })
    endDate: Date;

    // 챌린지 참가자 수
    @Column()
    participantCount: number;

    // 우승자
    @ManyToOne(() => User)
    winner: User;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
}
