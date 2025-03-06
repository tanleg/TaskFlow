import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { EntrepriseEntity } from './entreprise.entity';

@Entity('partenaire')
export class PartenaireEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique du partenaire

  @Column({ length: 150 })
  nom: string; // Nom du partenaire

  @Column({ length: 150 })
  prenom: string; // Prénom du partenaire

  @Column({ length: 150 })
  email: string; // Adresse email du partenaire

  @Column({ length: 200 })
  lien: string; // Lien vers la page projet

  @Column({ length: 255, unique: true })
  token: string; // Token unique pour l'identification du partenaire

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Projet auquel le partenaire est rattaché

  @ManyToOne(() => EntrepriseEntity, { nullable: false })
  @JoinColumn({ name: 'entreprise' })
  entreprise: EntrepriseEntity; // Entreprise à laquelle appartient le partenaire
}
