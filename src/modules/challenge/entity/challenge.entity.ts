import { User } from "@/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable, ManyToOne } from "typeorm";

@Entity()
export class Challenge {
    @PrimaryGeneratedColumn()
    id: number;

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

    // 챌린지 참가자들 (ManyToMany 관계)
    @ManyToMany(() => User, user => user.id)
    @JoinTable()
    participants: User[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;
}
