import { User } from "@/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";

@Entity()
export class Challenge {
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

    @Column()
    isFinished: boolean;

    // 챌린지 종료 날짜
    @Column({ type: "timestamptz" })
    endDate: Date;

    // 챌린지 참가자들 (ManyToMany 관계)
    @ManyToMany(() => User)
    @JoinTable()
    participants: User[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;
}
