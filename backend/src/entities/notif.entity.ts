import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('notif')
export class NotifEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique de la notification

  @Column({ length: 50 })
  titre: string; // Titre de la notification

  @Column({ length: 2000 })
  contenu: string; // Contenu détaillé de la notification

  @Column()
  date_notif: Date; // Date et heure de l'envoi de la notification

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Projet auquel la notification est liée

  @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.notifs)
  utilisateurs: UtilisateurEntity[]; // Liste des utilisateurs recevant la notification
}
