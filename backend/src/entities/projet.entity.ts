import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { StatutProjetEntity } from './statut_projet.entity';
import { FichierEntity } from './fichier.entity';
import { JalonEntity } from './jalon.entity';
import { LivrableEntity } from './livrable.entity';
import { MessageEntity } from './message.entity';
import { UtilisateurEntity } from './utilisateur.entity';
import { NotifEntity } from './notif.entity';
import { PartenaireEntity } from './partenaire.entity';
import { TacheEntity } from './tache.entity';
import { UtilisateurProjetEntity } from './utilisateur_projet.entity';

@Entity('projet')
export class ProjetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nom: string;

  @Column({ length: 2000 })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ type: 'boolean', default: false })
  public: boolean;

  @Column({ length: 150 })
  statut: string;

  // Relations OneToMany avec les autres entités
  @OneToMany(() => FichierEntity, fichier => fichier.projet)
  fichiers: FichierEntity[];

  @OneToMany(() => JalonEntity, jalon => jalon.projet)
  jalons: JalonEntity[];

  @OneToMany(() => LivrableEntity, livrable => livrable.projet)
  livrables: LivrableEntity[];

  @OneToMany(() => MessageEntity, message => message.projet)
  messages: MessageEntity[];

  @OneToMany(() => NotifEntity, notif => notif.projet)
  notifications: NotifEntity[];

  @OneToMany(() => PartenaireEntity, partenaire => partenaire.projet)
  partenaires: PartenaireEntity[];

  @OneToMany(() => TacheEntity, tache => tache.projet)
  taches: TacheEntity[];

  @OneToMany(() => UtilisateurProjetEntity, utilisateurProjet => utilisateurProjet.projet)
  utilisateurProjets: UtilisateurProjetEntity[];

  // Relation avec le statut
  @ManyToOne(() => StatutProjetEntity, statut => statut.projets)
  @JoinColumn({ name: 'statut' })
  statutProjet: StatutProjetEntity;
}
