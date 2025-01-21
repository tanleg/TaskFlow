import { IsInt, IsNotEmpty } from 'class-validator';

export class AjoutUtilisateurProjetDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsNotEmpty()
  id_utilisateur: number;
}
