import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Shows, (show) => show.prices, { onDelete: 'CASCADE' })
  show: Shows;

  @OneToMany(() => Seats, (seats) => seats.price, { cascade: true })
  seats: Seats;

  @OneToOne(() => Sections, (section) => section.price, { cascade: true })
  @JoinColumn()
  section: Section
}
