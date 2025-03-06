import { Entity, PrimaryColumn } from 'typeorm';

@Entity('entreprise')
export class EntrepriseEntity {
  @PrimaryColumn()
  entreprise: string;
}
