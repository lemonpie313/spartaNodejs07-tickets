import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Shows } from './shows.entity';
import { Seats } from './seats.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('show_date')
@Unique(['show', 'showDate'])
export class ShowDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false})
  numberOfTimes: number;

  @Column({ type: 'datetime', nullable: false })
  showDate: Date;

  @ManyToOne(() => Shows, (show) => show.showDate)
  show: Shows;

  @OneToMany(() => Seats, (seats) => seats.showDate)
  seats: Seats;

  @OneToMany(() => Tickets, (tickets) => tickets.showDate)
  tickets: Tickets;
}
