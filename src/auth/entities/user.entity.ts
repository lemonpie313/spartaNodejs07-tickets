import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../types/userRole.type";

@Entity('user')
export class User{
    @PrimaryGeneratedColumn()
    userId: number;
  
    @Column({ type: 'varchar', unique: true, nullable: false })
    email: string;
  
    @Column({ type: 'varchar', nullable: false })
    password: string;
  
    @Column({ type: 'varchar', select: false, nullable: false })
    userName: string;
  
    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;
  
    @Column({ type: 'int', select: true, nullable: false })
    birthDate: number;
  
    @Column({ type: 'int', select: true, nullable: false })
    points: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
}