import { Seats } from 'src/shows/entities/seats.entity';
import { Show } from 'src/shows/entities/show.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @ManyToOne(() => Show, (show) => show.tickets)
  show: Show;

  @OneToOne(() => Seats, (seat) => seat.tickets)
  @JoinColumn()
  seat: Seats;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;
}
