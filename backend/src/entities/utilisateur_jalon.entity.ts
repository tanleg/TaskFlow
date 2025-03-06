import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JalonEntity } from './jalon.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_jalon')
export class UtilisateurJalonEntity {
  @PrimaryColumn()
  id: number;  // JalonId comme clé primaire partagée

  @PrimaryColumn()
  id_utilisateur: number;  // UtilisateurId comme clé primaire partagée

  @ManyToOne(() => JalonEntity, jalon => jalon.utilisateurs)
  @JoinColumn({ name: 'id' })  
  jalon: JalonEntity; // Lien vers l'entité JalonEntity, représente le jalon associé à l'utilisateur

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.jalons)
  @JoinColumn({ name: 'id_utilisateur' })  
  utilisateur: UtilisateurEntity; // Lien vers l'entité UtilisateurEntity, représente l'utilisateur associé au jalon
}
