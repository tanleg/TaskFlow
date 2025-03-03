import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity'; // Assurez-vous que le chemin vers le fichier ProjetEntity est correct
import { UtilisateurEntity } from './utilisateur.entity'; // Assurez-vous que le chemin vers le fichier UtilisateurEntity est correct
import { PartenaireEntity } from './partenaire.entity'; // Assurez-vous que le chemin vers le fichier PartenaireEntity est correct

@Entity('fichier')
export class FichierEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nom: string;

  @Column({ length: 200 })
  url: string;

  @Column()
  date_upload: Date;

  @Column()
  version: number;

  @Column()
  id_projet: number;

  @Column({ nullable: true })
  id_utilisateur: number;

  @Column({ nullable: true })
  id_partenaire: number;

  // Si vous avez des relations, assurez-vous qu'elles sont correctement configurées
  @ManyToOne(() => ProjetEntity)
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @ManyToOne(() => UtilisateurEntity, { nullable: true })
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;

  // Etc.
}