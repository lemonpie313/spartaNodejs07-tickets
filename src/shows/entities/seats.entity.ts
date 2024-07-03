import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Show } from './show.entity';
import { Prices } from './prices.entity';

@Entity('seats')
@Unique(['show', 'date', 'section', 'row', 'seatNumber'])
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

  @ManyToOne(() => Show, (show) => show.seats)
  show: Show;

  @ManyToOne(() => Prices, (prices) => prices.seats)
  prices: Prices;
}
