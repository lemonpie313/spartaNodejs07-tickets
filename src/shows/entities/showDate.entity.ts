import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Show } from './show.entity';

@Entity('show_date')
@Unique(['show', 'showDate'])
export class ShowDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', nullable: false })
  showDate: Date;

  @ManyToOne(() => Show, (show) => show.showDate)
  show: Show;
}
