import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class VerificationCode {
    @PrimaryColumn()
    uuid: string
    
    @Column()
    phoneNumber: string

    @Column()
    code: string

    @Column({type:"timestamptz"})
    expiredAt: Date
}
