import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { EntrepriseEntity } from './entreprise.entity';

@Entity('partenaire')
export class PartenaireEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nom: string;

  @Column({ length: 150 })
  prenom: string;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 200 })
  lien: string;

  @Column({ length: 255, unique: true })
  token: string;

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @ManyToOne(() => EntrepriseEntity, { nullable: false })
  @JoinColumn({ name: 'entreprise' })
  entreprise: EntrepriseEntity;
}
