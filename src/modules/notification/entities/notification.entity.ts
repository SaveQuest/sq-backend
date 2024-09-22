import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  description: string;

  @Column('simple-json', { nullable: true })
  handler: {
    type: 'collect' | 'scheme' | 'url';
    id: string;
  };
}