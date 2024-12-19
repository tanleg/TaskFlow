import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';
import { Tache } from '../../../shared/src/types/tache.type';

@Entity("tache")
export class TacheEntity implements Tache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ type: 'timestamp' })
  date_debut: Date;

  @Column({type: 'timestamp', nullable: true})
  date_fin_reelle: Date | null ;

  @Column({ type: 'timestamp' })
  date_fin: Date;

  @Column({ default: false })
  termine: boolean;

  @Column()
  id_projet: number;

  @Column()
  id_utilisateur: number;
}
