import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class VerificationCode {
    @PrimaryColumn()
    token: string
    
    @Column()
    phoneNumber: string

    @Column()
    code: string

    @Column({type:"timestamptz"})
    expiredAt: Date
}
