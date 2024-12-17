import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Jalon } from '../../../shared/src/types/jalon.type';

@Entity("jalon")
export class JalonEntity implements Jalon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  date_fin: Date;

  @Column()
  id_projet: number;
}
