import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateFichierDto {

  // nom : Le nom du fichier. Il doit être une chaîne de caractères et ne peut pas être vide.
  @IsString()
  @IsNotEmpty()
  nom: string;

  // id_projet : L'ID du projet auquel ce fichier est associé. Il doit être un nombre.
  @IsNumber()
  id_projet: number;

  // upload_par : Le nom de la personne qui a téléchargé le fichier. Il doit être une chaîne de caractères et ne peut pas être vide.
  @IsString()
  @IsNotEmpty()
  upload_par: string;
}
