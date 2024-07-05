import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shows } from './shows.entity';
import { Prices } from './prices.entity';
import { ShowDate } from './showDate.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';
import { Sections } from './sections.entity';

@Entity('seats')
@Index('unique_active_column', ['show', 'showDate', 'section', 'row', 'seatNumber'], { where: '"deletedAt" IS NULL' })
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

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Shows, (show) => show.seats, { onDelete: 'CASCADE' })
  show: Shows;

  @ManyToOne(() => Prices, (price) => price.seats, { onDelete: 'CASCADE' })
  price: Prices;

  @ManyToOne(() => Sections, (section) => section.seats, { onDelete: 'CASCADE' })
  section: Sections;

  @ManyToOne(() => ShowDate, (showDate) => showDate.seats, { onDelete: 'CASCADE' })
  showDate: ShowDate;

  @OneToOne(() => Tickets, (tickets) => tickets.seat, { cascade: true })
  tickets: Tickets;
}
