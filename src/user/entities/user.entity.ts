import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../types/userRole.type';
import { Tickets } from 'src/tickets/entities/tickets.entity';

@Entity('users')
@Index('unique_active_column', ['email'], { where: '"deletedAt" IS NULL' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  userName: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ type: 'varchar', select: true, nullable: false })
  birthDate: string;

  @Column({type: 'varchar', nullable: false})
  phoneNumber: string;

  @Column({type: 'varchar', nullable: false})
  address: string;

  @Column({ type: 'int', select: true, nullable: false })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Tickets, (tickets) => tickets.user, { cascade: true })
  tickets: Tickets;
}
