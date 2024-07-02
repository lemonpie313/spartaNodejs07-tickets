import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Show } from "./show.entity";

@Entity('artists')
export class Artists {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'varchar'})
    artistName: string;

    @ManyToOne(() => Show, (show) => show.showDate)
    show: Show
}