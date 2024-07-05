import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Shows } from './shows.entity';
import { Prices } from './prices.entity';
import { ShowDate } from './showDate.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';
import { Sections } from './sections.entity';

@Entity('seats')
@Unique(['show', 'showDate', 'section', 'row', 'seatNumber'])
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

  @ManyToOne(() => Shows, (show) => show.seats)
  show: Shows;

  @ManyToOne(() => Prices, (price) => price.seats)
  price: Prices;

  @ManyToOne(() => Sections, (section) => section.seats)
  section: Sections;

  @ManyToOne(() => ShowDate, (showDate) => showDate.seats)
  showDate: ShowDate;

  @OneToOne(() => Tickets, (tickets) => tickets.seat)
  tickets: Tickets;
}
