import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { ProjetEntity } from './projet.entity';

@Entity('statut_projet')
export class StatutProjetEntity {
  @PrimaryColumn({ length: 150 })
  statut: string; // Statut du projet (par exemple : "En cours", "Terminé", etc.)

  @OneToMany(() => ProjetEntity, projet => projet.statutProjet)
  projets: ProjetEntity[]; // Liste des projets ayant ce statut
}
