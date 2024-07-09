import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shows } from './shows.entity';
import { Seats } from './seats.entity';
import { Prices } from './prices.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('sections')
@Index('unique_active_column', ['section', 'show'], { where: '"deletedAt" IS NULL' })
export class Sections {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  section: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Shows, (show) => show.sections, { onDelete: 'CASCADE' })
  show: Shows;

  @OneToMany(() => Seats, (seats) => seats.section, { cascade: true })
  seats: Seats;

  @OneToMany(() => Tickets, (tickets) => tickets.section)
  tickets: Tickets;

  @OneToOne(() => Prices, (price) => price.section, { onDelete: 'CASCADE' })
  price: Prices;
}
