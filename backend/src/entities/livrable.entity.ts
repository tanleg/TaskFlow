import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Livrable } from '../../../shared/src/types/livrable.type';

@Entity("livrable")
export class LivrableEntity implements Livrable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  date_fin: Date;

  @Column({nullable: true})
  date_fin_reelle: Date | null;

  @Column({ default: false })
  termine: boolean;

  @Column()
  id_projet: number;
}
