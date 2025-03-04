import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProjetEntity } from './projet.entity'; // Assurez-vous que le chemin vers le fichier ProjetEntity est correct

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

  @Column({ length: 255 })
  upload_par: string;

  @ManyToOne(() => ProjetEntity)
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

}