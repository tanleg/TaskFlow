import { Entity, PrimaryColumn } from 'typeorm';

/** Représente une entreprise dans la base de données. */
@Entity('entreprise')
export class EntrepriseEntity {
  
  /** Clé primaire de l'entreprise (nom ou identifiant unique). */
  @PrimaryColumn()
  entreprise: string;
}
