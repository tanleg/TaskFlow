import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MessageEntity } from './message.entity';
import { TacheEntity } from './tache.entity';
import { UtilisateurJalonEntity } from './utilisateur_jalon.entity';
import { UtilisateurLivrableEntity } from './utilisateur_livrable.entity';
import { UtilisateurNotifEntity } from './utilisateur_notif.entity';
import { UtilisateurProjetEntity } from './utilisateur_projet.entity';

@Entity('utilisateur')
export class UtilisateurEntity {
  @PrimaryGeneratedColumn()
  id: number;  // Identifiant unique de l'utilisateur

  @Column()
  nom: string;  // Nom de l'utilisateur

  @Column()
  prenom: string;  // Prénom de l'utilisateur

  @Column()
  email: string;  // Adresse email de l'utilisateur

  @Column()
  mot_de_passe: string;  // Mot de passe de l'utilisateur (enregistré sous forme cryptée)

  @Column()
  telephone: string;  // Numéro de téléphone de l'utilisateur

  @Column()
  admin: boolean;  // Indique si l'utilisateur est un administrateur (true/false)

  @OneToMany(() => MessageEntity, message => message.utilisateur)
  messages: MessageEntity[];  // Liste des messages envoyés par l'utilisateur

  @OneToMany(() => TacheEntity, tache => tache.utilisateur)
  taches: TacheEntity[];  // Liste des tâches assignées à l'utilisateur

  @OneToMany(() => UtilisateurJalonEntity, utilisateurJalon => utilisateurJalon.utilisateur)
  jalons: UtilisateurJalonEntity[];  // Liste des jalons associés à l'utilisateur

  @OneToMany(() => UtilisateurLivrableEntity, utilisateurLivrable => utilisateurLivrable.utilisateur)
  livrables: UtilisateurLivrableEntity[];  // Liste des livrables associés à l'utilisateur

  @OneToMany(() => UtilisateurNotifEntity, utilisateurNotif => utilisateurNotif.utilisateur)
  notifs: UtilisateurNotifEntity[];  // Liste des notifications envoyées à l'utilisateur

  @OneToMany(() => UtilisateurProjetEntity, utilisateurProjet => utilisateurProjet.utilisateur)
  projets: UtilisateurProjetEntity[];  // Liste des projets associés à l'utilisateur

  utilisateurProjets: any;  // (non utilisé dans ce code mais peut être une relation supplémentaire)
}
