import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsDate, IsInt } from 'class-validator';

export class CreateTacheDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_debut: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_fin_reelle: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_fin: Date;

  @IsBoolean()
  @IsNotEmpty()
  termine: boolean = false;

  @IsInt()
  @IsNotEmpty()
  id_projet: number;

  @IsInt()
  @IsNotEmpty()
  id_utilisateur: number;
}
