import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { NotifEntity } from './notif.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_notif')
export class UtilisateurNotifEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NotifEntity, notif => notif.utilisateurs)
  @JoinColumn({ name: 'id' })
  notif: NotifEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.notifs)
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;
}
