import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Tache } from '../../../shared/src/types/tache.type';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('tache')
export class TacheEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique de la tâche

  @Column({ length: 50 })
  nom: string; // Nom de la tâche

  @Column({ type: 'timestamp' })
  date_debut: Date; // Date de début de la tâche

  @Column({type: 'timestamp', nullable: true})
  date_fin_reelle: Date | null; // Date de fin réelle de la tâche, peut être nulle si la tâche n'est pas terminée

  @Column({ type: 'timestamp' })
  date_fin: Date; // Date de fin prévue de la tâche

  @Column({ default: false })
  termine: boolean; // Indique si la tâche est terminée ou non (true/false)

  @ManyToOne(() => ProjetEntity, projet => projet.taches)
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Projet auquel cette tâche est associée

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.taches)
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity; // Utilisateur responsable de cette tâche
}
