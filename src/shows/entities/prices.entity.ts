import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shows } from "./shows.entity";
import { Seats } from "./seats.entity";
import { Sections } from "./sections.entity";
import { Section } from "aws-sdk/clients/connectcases";

@Entity('prices')
export class Prices {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Shows, (show) => show.prices)
  show: Shows;

  @OneToMany(() => Seats, (seats) => seats.price)
  seats: Seats;

  @OneToOne(() => Sections, (section) => section.price)
  @JoinColumn()
  section: Section
}
