import { CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class SeedingLog {
    @PrimaryColumn()
    logId: string

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}
