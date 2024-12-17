import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Projet } from '../../../shared/src/types/projet.type';

@Entity("projet")
export class ProjetEntity implements Projet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  description: string;

  @Column()
  date_creation: Date;

  @Column({ default: false })
  public: boolean;

  @Column()
  statut: string;

}
