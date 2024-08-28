import { Exclude } from "class-transformer";
import { User } from "@/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class Mileage {
    @Exclude()
    @Column()
    amount: number;

    @Column({ default: "" })
    content: string;

    @Exclude()
    @CreateDateColumn({ type: "timestamptz" })
    spend_at: Date;

    @OneToOne(() => User, user => user.userId, { onDelete: 'CASCADE' })
    userId: User;

    // cardIssuer: 카드사 (hanacard|kbcard|worricard|bccard|lottecard|kakaomini|tossuss)
    @Column({ type: "varchar" })
    cardIssuer: 'hanacard' | 'kbcard' | 'worricard' | 'bccard' | 'lottecard' | 'kakaomini' | 'tossuss';

    // approvalNumber: 카드 승인 번호 (Optional)
    @Column({ type: "varchar", nullable: true })
    approvalNumber?: string;

    // approvalTime: 카드 승인 일자 (Unix Timestamp)
    @Column({ type: "int" })
    approvalTime: number;

    // merchant.name: 가맹점 이름
    @Column({ type: "varchar" })
    merchantName: string;

    // merchant.category: 가맹점 업종 (Optional)
    @Column({ type: "varchar", nullable: true })
    merchantCategory?: string;

    // merchant.id: 가맹점 번호 (Optional)
    @Column({ type: "varchar", nullable: true })
    merchantId?: string;

    // merchant.businessNumber: 가맹점 사업자 번호 (Optional)
    @Column({ type: "varchar", nullable: true })
    merchantBusinessNumber?: string;
}
