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
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  email: string;

  @Column()
  mot_de_passe: string;

  @Column()
  telephone: string;

  @Column()
  admin: boolean;

  @OneToMany(() => MessageEntity, message => message.utilisateur)
  messages: MessageEntity[];

  @OneToMany(() => TacheEntity, tache => tache.utilisateur)
  taches: TacheEntity[];

  @OneToMany(() => UtilisateurJalonEntity, utilisateurJalon => utilisateurJalon.utilisateur)
  jalons: UtilisateurJalonEntity[];

  @OneToMany(() => UtilisateurLivrableEntity, utilisateurLivrable => utilisateurLivrable.utilisateur)
  livrables: UtilisateurLivrableEntity[];

  @OneToMany(() => UtilisateurNotifEntity, utilisateurNotif => utilisateurNotif.utilisateur)
  notifs: UtilisateurNotifEntity[];

  @OneToMany(() => UtilisateurProjetEntity, utilisateurProjet => utilisateurProjet.utilisateur)
  projets: UtilisateurProjetEntity[];
    utilisateurProjets: any;
}
