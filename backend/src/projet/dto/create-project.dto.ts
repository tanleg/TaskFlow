import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsDate } from 'class-validator';

// DTO pour la création d'un projet
export class CreateProjectDto {
  // Nom du projet (doit être une chaîne de caractères non vide)
  @IsString()
  @IsNotEmpty()
  nom: string;

  // Description du projet (doit être une chaîne de caractères non vide)
  @IsString()
  @IsNotEmpty()
  description: string;

  // Date de création du projet (doit être une date valide et non vide)
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  date_creation: Date;
  
  // Indicateur de projet public (doit être un booléen non vide, valeur par défaut : false)
  @IsBoolean()
  @IsNotEmpty()
  public: boolean = false;

  // Statut du projet (doit être une chaîne de caractères non vide)
  @IsString()
  @IsNotEmpty()
  statut: string;
}
