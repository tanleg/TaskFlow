import { IsInt, IsNotEmpty } from 'class-validator';

export class AjoutSupprUtilisateurProjetDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  id_utilisateur: number;
}
