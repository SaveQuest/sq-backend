import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ScheduledTask {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  taskName: string;

  @Column()
  scheduledTime: Date;

  @Column({ default: false })
  isExecuted: boolean;
}