import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Fichier } from '../../../shared/src/types/fichier.type';

@Entity("fichier")
export class FichierEntity implements Fichier{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    url: string;

    @Column()
    date_upload: Date;

    @Column()
    version: number;

    @Column()
    id_projet: number;

    @Column({nullable : true})
    id_utilisateur: number | null;

    @Column({nullable : true})
    id_partenaire: number | null;
}
