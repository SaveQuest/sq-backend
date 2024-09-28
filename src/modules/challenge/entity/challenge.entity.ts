import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Challenge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    joinCode: string;

    // 챌린지 제목
    @Column()
    name: string;

    // 챌린지 참가비
    @Column({default:0})
    entryFee: number;

    // 우승 상금
    @Column()
    prize: number;

    @Column()
    isFinished: boolean;
  
    // 챌린지 종료 날짜
    @Column({ type: "timestamptz" })
    endDate: Date;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @Column({type: "jsonb", default: {}})
    usage: Record<number, number>

    @Column()
    topic: string // category:게임

    @Column()
    isPublic: boolean;
}
