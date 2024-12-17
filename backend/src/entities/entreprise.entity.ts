import { Entity, PrimaryColumn } from 'typeorm';
import { Entreprise } from '../../../shared/src/types/entreprise.type';

@Entity("entreprise")
export class EntrepriseEntity implements Entreprise{
  @PrimaryColumn({ type: 'varchar', length: 200 })
  entreprise: string;
}
