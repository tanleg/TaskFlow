import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsInt } from 'class-validator';

export class CreateJalonDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_fin: Date;
  
  @IsInt()
  @IsNotEmpty()
  id_projet: number;
}
