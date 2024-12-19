import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity'; // Assurez-vous que le chemin vers le fichier ProjetEntity est correct
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('jalon')
export class JalonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column()
  date_fin: Date;

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.jalons)
  utilisateurs: UtilisateurEntity[];
  
}
