import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LivrableEntity } from './livrable.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_livrable')
export class UtilisateurLivrableEntity {
  @PrimaryColumn()
  id: number;
  
  @PrimaryColumn()
  id_utilisateur: number;

  @ManyToOne(() => LivrableEntity, livrable => livrable.utilisateurs)
  @JoinColumn({ name: 'id' })
  livrable: LivrableEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.livrables)
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;
}
