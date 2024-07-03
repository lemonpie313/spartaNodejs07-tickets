import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Show } from './show.entity';

@Entity('artists')
@Unique(['show', 'artistName'])
export class Artists {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  artistName: string;

  @ManyToOne(() => Show, (show) => show.artists)
  show: Show;
}
