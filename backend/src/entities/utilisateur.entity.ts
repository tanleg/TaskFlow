import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Utilisateur } from '../../../shared/src/types/utilisateur.type';

@Entity("utilisateur")
export class UtilisateurEntity implements Utilisateur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({unique:true})
  email: string;

  @Column()
  mot_de_passe: string;

  @Column()
  telephone: string;

  @Column({ default: false })
  admin: boolean;
}
