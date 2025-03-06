import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { NotifEntity } from './notif.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_notif')
export class UtilisateurNotifEntity {
  @PrimaryGeneratedColumn()
  id: number;  // Identifiant unique de la relation entre utilisateur et notification

  @ManyToOne(() => NotifEntity, notif => notif.utilisateurs)
  notif: NotifEntity; // Lien vers l'entité NotifEntity, représente la notification associée à l'utilisateur

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.notifs)
  utilisateur: UtilisateurEntity; // Lien vers l'entité UtilisateurEntity, représente l'utilisateur associé à la notification
}
