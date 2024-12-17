import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Message } from '../../../shared/src/types/message.type';

@Entity()
export class MessageEntity implements Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texte: string;

  @Column()
  date_envoi: Date;

  @Column({nullable: true})
  id_utilisateur: number | null;

  @Column()
  id_projet: number;

  @Column({nullable: true})
  id_partenaire: number | null;

}
