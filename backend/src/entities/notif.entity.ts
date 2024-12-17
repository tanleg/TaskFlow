import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Notif } from '../../../shared/src/types/notif.type';

@Entity()
export class NotifEntity implements Notif {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column()
  contenu: string;

  @Column()
  date_notif: Date;

  @Column()
  id_projet: number;
  
}
