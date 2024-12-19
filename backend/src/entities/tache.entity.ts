import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tache } from '../../../shared/src/types/tache.type';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('tache')
export class TacheEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nom: string;

  @Column({ type: 'timestamp' })
  date_debut: Date;

  @Column({type: 'timestamp', nullable: true})
  date_fin_reelle: Date | null ;

  @Column({ type: 'timestamp' })
  date_fin: Date;

  @Column({ default: false })
  termine: boolean;

  @ManyToOne(() => ProjetEntity, projet => projet.taches)
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.taches)
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;
}
