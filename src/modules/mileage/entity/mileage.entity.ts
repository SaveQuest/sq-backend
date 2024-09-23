import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mileage {
    @Exclude()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Exclude()
    @Column()
    amount: number;

    @Column({ type: "varchar" })
    cardIssuer: 'KB'

    @Column({ type: "varchar", nullable: true })
    approvalNumber: string;

    @Exclude()
    @CreateDateColumn({ type: "timestamptz" })
    approvalTime: Date;

    @Column({ type: "varchar" })
    merchantName: string;

    @Column({ type: "varchar", nullable: true })
    merchantId?: string;

    @Column({ type: "varchar", nullable: true })
    merchantBusinessNumber?: string;

    @Column({ type: "boolean", default: false })
    merchantIsForeign: boolean;
}
