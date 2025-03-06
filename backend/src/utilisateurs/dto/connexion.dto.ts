import { IsEmail, IsString } from 'class-validator';

export class ConnexionDto {
  @IsEmail() // Validation de l'email
  email: string;

  @IsString() // Validation du mot de passe
  mot_de_passe: string;
}
