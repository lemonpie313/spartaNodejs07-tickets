import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shows } from "./shows.entity";
import { Seats } from "./seats.entity";
import { Prices } from "./prices.entity";

@Entity('sections')
export class Sections {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  section: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Shows, (show) => show.sections)
  show: Shows;

  @OneToMany(() => Seats, (seats) => seats.section)
  seats: Seats;

  @OneToOne(() => Prices, (price) => price.section)
  price: Prices
}
