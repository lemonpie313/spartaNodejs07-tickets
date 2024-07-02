import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Show } from './show.entity';

@Entity('seats')
export class Seats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', nullable: false })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  section: string;

  @Column({ type: 'int', nullable: false })
  row: number;

  @Column({ type: 'int', nullable: false })
  seatNumber: number;

  @Column({ type: 'boolean', nullable: false })
  available: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Show, (show) => show.showDate)
  show: Show;
}
