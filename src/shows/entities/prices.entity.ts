import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Show } from "./show.entity";
import { Seats } from "./seats.entity";

@Entity('prices')
export class Prices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  section: string;

  @Column({ type: 'int', nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Show, (show) => show.prices)
  show: Show;

  @OneToMany(() => Seats, (seats) => seats.prices)
  seats: Seats;
}
