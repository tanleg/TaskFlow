import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_projet')
export class UtilisateurProjetEntity {
  // Clé primaire composite : id (clé étrangère vers Projet)
  @PrimaryColumn()
  id: number;

  // Clé primaire composite : id_utilisateur (clé étrangère vers Utilisateur)
  @PrimaryColumn()
  id_utilisateur: number;

  // Relation vers ProjetEntity (clé étrangère id -> Projet.id)
  @ManyToOne(() => ProjetEntity, projet => projet.utilisateurProjets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  projet: ProjetEntity;

  // Relation vers UtilisateurEntity (clé étrangère id_utilisateur -> Utilisateur.id)
  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.utilisateurProjets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;

  // Attributs
  @Column({ type: 'boolean' })
  chef: boolean;

  @Column({ type: 'boolean' })
  visiteur: boolean;
}
