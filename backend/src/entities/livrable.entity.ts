import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity('livrable')
export class LivrableEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID unique du livrable

  @Column({ length: 50 })
  nom: string; // Nom du livrable

  @Column()
  date_fin: Date; // Date prévue de livraison

  @Column({ nullable: true })
  date_fin_reelle: Date; // Date réelle de livraison (peut être null si non livré)

  @Column()
  termine: boolean; // Statut du livrable (terminé ou non)

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity; // Projet associé au livrable

  @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.livrables)
  utilisateurs: UtilisateurEntity[]; // Utilisateurs impliqués dans le livrable
}
