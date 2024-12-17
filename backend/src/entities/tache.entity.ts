import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Tache } from '../../../shared/src/types/tache.type';

@Entity()
export class TacheEntity implements Tache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  date_debut: Date;

  @Column({nullable: true})
  date_fin_reelle: Date | null ;

  @Column()
  date_fin: Date;

  @Column({ default: false })
  termine: boolean;

  @Column()
  id_projet: number;

  @Column()
  id_utilisateur: number;
}
