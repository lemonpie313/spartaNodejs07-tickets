import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Show } from './show.entity';
import { Seats } from './seats.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('show_date')
@Unique(['show', 'showDate'])
export class ShowDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', nullable: false })
  showDate: Date;

  @ManyToOne(() => Show, (show) => show.showDate)
  show: Show;

  @OneToMany(() => Seats, (seats) => seats.showDate)
  seats: Seats;

  @OneToMany(() => Tickets, (tickets) => tickets.showDate)
  tickets: Tickets;
}
