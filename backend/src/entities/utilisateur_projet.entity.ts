import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UtilisateurProjet } from '../../../shared/src/types/utilisateur_projet.type';

@Entity("utilisateur_projet")
export class UtilisateurProjetEntity implements UtilisateurProjet {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    id_utilisateur: number;
  
    @Column({ default: false })
    chef: boolean;
  
    @Column({ default: false })
    visiteur: boolean;
  
}
