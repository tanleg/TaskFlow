import { Entity, PrimaryColumn } from 'typeorm';
import { StatutProjet } from '../../../shared/src/types/statut_projet.type';

@Entity("statut_projet")
export class StatutProjetEntity implements StatutProjet{
  @PrimaryColumn({ type: 'varchar', length: 150 })
  statut: string;
}