import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateFichierDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  id_projet: number; // Ajouter id_projet

  @IsInt()
  id_utilisateur: number; // Ajouter id_utilisateur

  nextVersion?: number; // Champ facultatif pour la version
}
