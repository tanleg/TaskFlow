import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUtilisateurDto {
    @IsString()
    @IsNotEmpty()
    nom: string;

    @IsString()
    @IsNotEmpty()
    prenom: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    mot_de_passe: string;

    @IsString()
    @IsNotEmpty()
    telephone: string;

    @IsBoolean()
    @IsNotEmpty()
    admin: boolean;
}
