import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UtilisateurNotif } from '../../../shared/src/types/utilisateur_notif.type';

@Entity("utilisateur_notif")
export class UtilisateurNotifEntity implements UtilisateurNotif {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryGeneratedColumn()
    id_utilisateur: number;  
}
