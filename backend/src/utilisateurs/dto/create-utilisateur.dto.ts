import { IsString, IsEmail, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateUtilisateurDto {
    @IsString() 
    @IsNotEmpty() 
    nom: string; // Nom de l'utilisateur

    @IsString() 
    @IsNotEmpty() 
    prenom: string; // Prénom de l'utilisateur

    @IsEmail()
    @IsNotEmpty() 
    email: string; // Email de l'utilisateur

    @IsString() 
    @IsNotEmpty() 
    mot_de_passe: string; // Mot de passe de l'utilisateur

    @IsString() 
    @IsNotEmpty() 
    telephone: string; // Numéro de téléphone

    @IsBoolean() 
    @IsNotEmpty() 
    admin: boolean; // Si l'utilisateur est administrateur
}
