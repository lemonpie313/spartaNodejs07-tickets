import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Shows } from './shows.entity';

@Entity('artists')
@Unique(['show', 'artistName'])
export class Artists {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  artistName: string;

  @ManyToOne(() => Shows, (show) => show.artists)
  show: Shows;
}
