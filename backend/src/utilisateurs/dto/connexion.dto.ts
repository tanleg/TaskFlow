import { IsEmail, IsString } from 'class-validator';

export class ConnexionDto {
  @IsEmail()
  email: string;

  @IsString()
  mot_de_passe: string;
}
