import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Show } from "./show.entity";

@Entity('show_date')
export class ShowDate {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({type: 'datetime'})
    showDate: Date;

    @ManyToOne(() => Show, (show) => show.showDate)
    show: Show
}