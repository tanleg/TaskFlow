import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsInt, IsBoolean } from 'class-validator';

export class CreateLivrableDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_fin: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_fin_reelle: Date;
  
  @IsBoolean()
  @IsNotEmpty()
  termine: boolean = false;

  @IsInt()
  @IsNotEmpty()
  id_projet: number;
}
