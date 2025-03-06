import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFichierDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsNumber()
  id_projet: number;

  @IsString()
  @IsNotEmpty()
  upload_par: string;
}
