import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UtilisateurLivrable } from '../../../shared/src/types/utilisateur_livrable.type';

@Entity()
export class UtilisateurLivrableEntity implements UtilisateurLivrable {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    id_utilisateur: number;
}
