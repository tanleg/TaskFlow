import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Tache } from '../../../shared/src/types/tache.type';

@Entity('tache')
export class TacheEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nom: string;

  @Column()
  date_debut: Date;

  @Column({nullable: true})
  date_fin_reelle: Date | null ;

  @Column()
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
