import { IsInt, IsNotEmpty } from 'class-validator';

// DTO pour l'ajout ou la suppression d'un utilisateur à un projet
export class AjoutSupprUtilisateurProjetDto {
  // Identifiant du projet (doit être un entier non vide)
  @IsInt()
  @IsNotEmpty()
  id: number;

  // Identifiant de l'utilisateur (doit être un entier non vide)
  @IsInt()
  @IsNotEmpty()
  id_utilisateur: number;
}
