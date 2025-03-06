import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { StatutProjetEntity } from './statut_projet.entity';
import { FichierEntity } from './fichier.entity';
import { JalonEntity } from './jalon.entity';
import { LivrableEntity } from './livrable.entity';
import { MessageEntity } from './message.entity';
import { UtilisateurEntity } from './utilisateur.entity';
import { NotifEntity } from './notif.entity';
import { PartenaireEntity } from './partenaire.entity';
import { TacheEntity } from './tache.entity';
import { UtilisateurProjetEntity } from './utilisateur_projet.entity';

@Entity('projet')
export class ProjetEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique du projet

  @Column({ length: 150 })
  nom: string; // Nom du projet

  @Column({ length: 2000 })
  description: string; // Description détaillée du projet

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date; // Date de création du projet (par défaut : date actuelle)

  @Column({ type: 'boolean', default: false })
  public: boolean; // Statut de visibilité (public ou privé)

  @Column({ length: 150 })
  statut: string; // Statut du projet (en cours, terminé...)

  // Relations OneToMany avec les autres entités
  @OneToMany(() => FichierEntity, fichier => fichier.projet)
  fichiers: FichierEntity[]; // Liste des fichiers liés au projet

  @OneToMany(() => JalonEntity, jalon => jalon.projet)
  jalons: JalonEntity[]; // Liste des jalons du projet

  @OneToMany(() => LivrableEntity, livrable => livrable.projet)
  livrables: LivrableEntity[]; // Liste des livrables du projet

  @OneToMany(() => MessageEntity, message => message.projet)
  messages: MessageEntity[]; // Liste des messages liés au projet

  @OneToMany(() => NotifEntity, notif => notif.projet)
  notifications: NotifEntity[]; // Notifications associées au projet

  @OneToMany(() => PartenaireEntity, partenaire => partenaire.projet)
  partenaires: PartenaireEntity[]; // Liste des partenaires du projet

  @OneToMany(() => TacheEntity, tache => tache.projet)
  taches: TacheEntity[]; // Liste des tâches du projet

  @OneToMany(() => UtilisateurProjetEntity, utilisateurProjet => utilisateurProjet.projet)
  utilisateurProjets: UtilisateurProjetEntity[]; // Association des utilisateurs au projet

  // Relation avec le statut du projet
  @ManyToOne(() => StatutProjetEntity, statut => statut.projets)
  @JoinColumn({ name: 'statut' })
  statutProjet: StatutProjetEntity; // Statut du projet sous forme d'entité
}
