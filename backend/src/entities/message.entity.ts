import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';
import { PartenaireEntity } from './partenaire.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique du message

  @Column({ length: 2000 })
  texte: string; // Contenu du message

  @Column()
  date_envoi: Date; // Date et heure d'envoi du message

  @ManyToOne(() => UtilisateurEntity, { nullable: true })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity; // Utilisateur ayant envoyé le message (nullable)

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Projet auquel le message est lié

  @ManyToOne(() => PartenaireEntity, { nullable: true })
  @JoinColumn({ name: 'id_partenaire' })
  partenaire: PartenaireEntity; // Partenaire ayant envoyé le message (nullable)
}
