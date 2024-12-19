import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Timestamp } from 'typeorm';

export class TacheDto {

  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date_debut: Timestamp;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date_fin_reelle: Timestamp | null;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date_fin: Timestamp;

  @IsBoolean()
  @IsNotEmpty()
  termine: boolean;

  @IsNumber()
  @IsNotEmpty()
  id_utilisateur: number;
}
