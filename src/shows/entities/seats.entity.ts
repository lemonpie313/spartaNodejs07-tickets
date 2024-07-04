import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Show } from './show.entity';
import { Prices } from './prices.entity';
import { ShowDate } from './showDate.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('seats')
@Unique(['show', 'showDate', 'prices', 'row', 'seatNumber'])
export class Seats {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => ShowDate, (showDate) => showDate.seats)
  showDate: ShowDate;

  @OneToOne(() => Tickets, (tickets) => tickets.seat)
  tickets: Tickets;
}
