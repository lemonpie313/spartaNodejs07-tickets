import { Seats } from 'src/shows/entities/seats.entity';
import { Shows } from 'src/shows/entities/shows.entity';
import { ShowDate } from 'src/shows/entities/showDate.entity';
import { Users } from 'src/user/entities/user.entity';
import {
    Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sections } from 'src/shows/entities/sections.entity';
import { Prices } from 'src/shows/entities/prices.entity';

@Entity('tickets')
@Index('unique_active_column', ['seat'], { where: '"deletedAt" IS NULL' })
export class Tickets {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  receiverName: string;

  @Column({ type: 'varchar', nullable: false })
  receiverPhoneNumber: string;

  @Column({ type: 'varchar', nullable: false })
  receiverAddress: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Shows, (show) => show.tickets)
  show: Shows;

  @ManyToOne(() => Sections, (section) => section.tickets)
  section: Sections;

  @ManyToOne(() => Prices, (price) => price.tickets)
  price: Prices;

  @ManyToOne(() => Seats, (seat) => seat.tickets)
  seat: Seats;

  @ManyToOne(() => Users, (receiver) => receiver.tickets)
  receiver: Users;

  @ManyToOne(() => ShowDate, (showDate) => showDate.tickets, { onDelete: 'CASCADE' })
  showDate: ShowDate;
}
