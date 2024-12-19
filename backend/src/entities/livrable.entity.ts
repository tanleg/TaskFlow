import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity'; 
import { UtilisateurEntity } from './utilisateur.entity'; 


@Entity('livrable')
export class LivrableEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  nom: string;

  @Column()
  date_fin: Date;

  @Column({ nullable: true })
  date_fin_reelle: Date;

  @Column()
  termine: boolean;

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.livrables)
    utilisateurs: UtilisateurEntity[];
}
