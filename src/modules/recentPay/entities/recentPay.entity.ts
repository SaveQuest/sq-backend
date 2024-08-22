import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "@/modules/user/entities/user.entity";

@Entity()
export class challenge {
    @Column({ default: 0 })
    today: number

    @Column({ default: 0 })
    yesterday: number
    
    @OneToOne(() => User, users =>users.userId)
    user: number
}