import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity'; // Assurez-vous du chemin vers UtilisateurEntity
import { PartenaireEntity } from './partenaire.entity'; // Assurez-vous du chemin vers PartenaireEntity

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2000 })
  texte: string;

  @Column()
  date_envoi: Date;

  @ManyToOne(() => UtilisateurEntity, { nullable: true })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @ManyToOne(() => PartenaireEntity, { nullable: true })
  @JoinColumn({ name: 'id_partenaire' })
  partenaire: PartenaireEntity;
}
