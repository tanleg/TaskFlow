import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('jalon')
export class JalonEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique du jalon

  @Column({ length: 100 })
  nom: string; // Nom du jalon

  @Column()
  date_fin: Date; // Date limite du jalon

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Projet auquel le jalon est rattaché

  @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.jalons)
  utilisateurs: UtilisateurEntity[]; // Liste des utilisateurs associés au jalon
}
