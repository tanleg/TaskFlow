import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity';
import { UtilisateurEntity } from './utilisateur.entity';


@Entity('notif')
export class NotifEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  titre: string;

  @Column({ length: 2000 })
  contenu: string;

  @Column()
  date_notif: Date;

  @ManyToOne(() => ProjetEntity, { nullable: false })
  @JoinColumn({ name: 'id_projet' })
  projet: ProjetEntity;

  @OneToMany(() => UtilisateurEntity, utilisateur => utilisateur.notifs)
      utilisateurs: UtilisateurEntity[];
}
