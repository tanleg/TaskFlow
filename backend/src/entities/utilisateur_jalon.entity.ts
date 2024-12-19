import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JalonEntity } from './jalon.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('utilisateur_jalon')
export class UtilisateurJalonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => JalonEntity, jalon => jalon.utilisateurs)
  @JoinColumn({ name: 'id' })
  jalon: JalonEntity;

  @ManyToOne(() => UtilisateurEntity, utilisateur => utilisateur.jalons)
  @JoinColumn({ name: 'id_utilisateur' })
  utilisateur: UtilisateurEntity;
  
}
