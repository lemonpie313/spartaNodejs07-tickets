import { Seats } from 'src/shows/entities/seats.entity';
import { Shows } from 'src/shows/entities/shows.entity';
import { ShowDate } from 'src/shows/entities/showDate.entity';
import { Users } from 'src/user/entities/user.entity';
import {
    Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tickets')
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

  @ManyToOne(() => Shows, (show) => show.tickets)
  show: Shows;

  @OneToOne(() => Seats, (seat) => seat.tickets)
  @JoinColumn()
  seat: Seats;

  @ManyToOne(() => Users, (user) => user.tickets)
  user: Users;

  @ManyToOne(() => ShowDate, (showDate) => showDate.tickets)
  showDate: ShowDate;
}
