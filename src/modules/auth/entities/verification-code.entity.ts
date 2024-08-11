import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class VerificationCode {
    @PrimaryColumn()
    phoneNumber: string

    @Column()
    token: string

    @Column()
    code: string

    @Column({type:"timestamptz"})
    expiredAt: Date
}
