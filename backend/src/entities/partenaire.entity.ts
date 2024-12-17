import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Partenaire } from '../../../shared/src/types/partenaire.type';

@Entity()
export class PartenaireEntity implements Partenaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  email: string;

  @Column()
  lien: string;

  @Column()
  id_projet: number;

  @Column()
  entreprise: string;
}
