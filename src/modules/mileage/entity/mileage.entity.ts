import { Exclude } from "class-transformer";
import { User } from "@/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class mileage {
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
}