import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShowDate } from './showDate.entity';
import { Artists } from './artists.entity';
import { Seats } from './seats.entity';
import { Prices } from './prices.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('show')
export class Show {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  showName: string;

  @Column({ type: 'int', nullable: false })
  availableAge: number;

  @Column({ type: 'int', nullable: false })
  availableForEach: number;

  @Column({ type: 'varchar', nullable: false })
  genre: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: false })
  introduction: string;

  @Column({ type: 'datetime', nullable: false })
  ticketOpensAt: Date;

  @Column({ type: 'int', nullable: false })
  runTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ShowDate, (showDate) => showDate.show)
  showDate: ShowDate[];

  @OneToMany(() => Artists, (artists) => artists.show)
  artists: Artists[];

  @OneToMany(() => Seats, (seats) => seats.show)
  seats: Seats[];

  @OneToMany(() => Prices, (prices) => prices.show)
  prices: Prices[];

  @OneToMany(() => Tickets, (tickets) => tickets.show)
  tickets: Tickets;
}
