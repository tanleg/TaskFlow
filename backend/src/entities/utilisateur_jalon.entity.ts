import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UtilisateurJalon } from '../../../shared/src/types/utilisateur_jalon.type';

@Entity("utilisateur_jalon")
export class UtilisateurJalonEntity implements UtilisateurJalon {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    id_utilisateur: number;  
}
