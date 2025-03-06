import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity';

@Entity('fichier')
export class FichierEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique du fichier

  @Column({ length: 50 })
  nom: string; // Nom du fichier

  @Column({ length: 200 })
  url: string; // URL de stockage du fichier

  @Column()
  date_upload: Date; // Date d’upload du fichier

  @Column()
  version: number; // Numéro de version du fichier

  @Column()
  id_projet: number; // ID du projet associé (stocké mais redondant avec la relation)

  @Column({ length: 255 })
  upload_par: string; // Nom de l’utilisateur ayant uploadé le fichier

  @ManyToOne(() => ProjetEntity)
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Relation avec le projet associé
}
