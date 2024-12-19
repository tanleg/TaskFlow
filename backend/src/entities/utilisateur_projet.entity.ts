import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_projet')
export class UtilisateurProjetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProjetEntity, projet => projet.utilisateurs)
  @JoinColumn({ name: 'id' })
  projet: ProjetEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.projets)
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;

  @Column()
  chef: boolean;

  @Column()
  visiteur: boolean;
}
