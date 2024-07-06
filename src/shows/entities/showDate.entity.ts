import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Shows } from './shows.entity';
import { Seats } from './seats.entity';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('show_date')
@Index('unique_active_column', ['show', 'showDate'], { where: '"deletedAt" IS NULL' })
export class ShowDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', nullable: false})
  numberOfTimes: number;

  @Column({ type: 'datetime', nullable: false })
  showDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Shows, (show) => show.showDate, { onDelete: 'CASCADE' })
  show: Shows;

  @OneToMany(() => Seats, (seats) => seats.showDate, { cascade: true })
  seats: Seats;

  @OneToMany(() => Tickets, (tickets) => tickets.showDate, { cascade: true })
  tickets: Tickets;
}
