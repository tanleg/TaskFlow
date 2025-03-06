import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LivrableEntity } from './livrable.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_livrable')
export class UtilisateurLivrableEntity {
  @PrimaryColumn()
  id: number;  // Identifiant unique de la relation entre utilisateur et livrable

  @PrimaryColumn()
  id_utilisateur: number;  // UtilisateurId comme clé primaire partagée pour lier les utilisateurs aux livrables

  @ManyToOne(() => LivrableEntity, livrable => livrable.utilisateurs)
  livrable: LivrableEntity; // Lien vers l'entité LivrableEntity, représente le livrable associé à l'utilisateur

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.livrables)
  utilisateur: UtilisateurEntity; // Lien vers l'entité UtilisateurEntity, représente l'utilisateur associé au livrable
}
