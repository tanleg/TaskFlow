import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_projet')
export class UtilisateurProjetEntity {
  @PrimaryColumn()
  id: number;  // Identifiant unique de la relation entre utilisateur et projet (clé primaire partagée)

  @PrimaryColumn()
  id_utilisateur: number;  // Identifiant de l'utilisateur, utilisé comme clé primaire partagée pour la relation

  @ManyToOne(() => ProjetEntity, projet => projet.utilisateurProjets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  projet: ProjetEntity; // Lien vers l'entité ProjetEntity, représente le projet auquel l'utilisateur est associé

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.utilisateurProjets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity; // Lien vers l'entité UtilisateurEntity, représente l'utilisateur associé au projet

  @Column({ type: 'boolean' })
  chef: boolean;  // Indique si l'utilisateur est le chef du projet (true/false)

  @Column({ type: 'boolean' })
  visiteur: boolean;  // Indique si l'utilisateur a un rôle de visiteur sur le projet (true/false)
}
