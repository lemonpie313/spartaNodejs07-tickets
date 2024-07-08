import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShowDate } from './show-date.entity';
import { Artists } from './artists.entity';
import { Seats } from './seats.entity';
import { Prices } from './prices.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';
import { Sections } from './sections.entity';
import { Genre } from '../types/genre.type';

@Entity('shows')
@Index('unique_active_column', ['showName'], { where: '"deletedAt" IS NULL' })
export class Shows {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  showName: string;

  @Column({type: 'varchar', nullable: false})
  showImage: string;

  @Column({ type: 'int', nullable: false })
  availableAge: number;

  @Column({ type: 'int', nullable: false })
  availableForEach: number;

  @Column({ type: 'varchar', nullable: false })
  genre: Genre;

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

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ShowDate, (showDate) => showDate.show, { cascade: true })
  showDate: ShowDate[];

  @OneToMany(() => Artists, (artists) => artists.show, { cascade: true })
  artists: Artists[];

  @OneToMany(() => Seats, (seats) => seats.show, { cascade: true })
  seats: Seats[];

  @OneToMany(() => Prices, (prices) => prices.show, { cascade: true })
  prices: Prices[];

  @OneToMany(() => Sections, (sections) => sections.show, { cascade: true })
  sections: Sections[];

  @OneToMany(() => Tickets, (tickets) => tickets.show, { cascade: true })
  tickets: Tickets;
}
