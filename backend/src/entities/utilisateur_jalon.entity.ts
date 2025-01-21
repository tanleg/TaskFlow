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
  @JoinColumn({ name: 'id' })  // Spécifier la colonne de jointure
  jalon: JalonEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.jalons)
  @JoinColumn({ name: 'id_utilisateur' })  // Spécifier la colonne de jointure
  utilisateur: UtilisateurEntity;
}
