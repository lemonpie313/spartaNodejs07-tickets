import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shows } from './shows.entity';

@Entity('artists')
@Index('unique_active_column', ['show', 'artistName'], { where: '"deletedAt" IS NULL' })
export class Artists {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  artistName: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Shows, (show) => show.artists, { onDelete: 'CASCADE' })
  show: Shows;
}
