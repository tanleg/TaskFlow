import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilisateursService {
    constructor(
        @InjectRepository(UtilisateurEntity)
        private readonly utilisateurRepository: Repository<UtilisateurEntity>, // Injecte le repository pour l'accès aux données
        private readonly jwtService: JwtService, // Injecte le service JWT pour la gestion des tokens
    ) {}

    // Crée un utilisateur et génère un token d'accès
    async create(createUtilisateurDto: CreateUtilisateurDto): Promise<{ accessToken: string }> {
        const hashedPassword = await bcrypt.hash(createUtilisateurDto.mot_de_passe, 10); // Hashage du mot de passe avant de le sauvegarder
        const utilisateur = this.utilisateurRepository.create({
            nom: createUtilisateurDto.nom,
            prenom: createUtilisateurDto.prenom,
            email: createUtilisateurDto.email,
            mot_de_passe: hashedPassword, // Le mot de passe est crypté avant d'être sauvegardé
            telephone: createUtilisateurDto.telephone,
            admin: createUtilisateurDto.admin,
        });
    
        const savedUser = await this.utilisateurRepository.save(utilisateur); // Sauvegarde l'utilisateur en base de données
        const accessToken = await this.generateJwt(savedUser); // Génére un JWT pour l'utilisateur

        return { accessToken }; // Retourne le token généré
    }

    // Vérifie si l'utilisateur existe et si le mot de passe est valide
    async validateUser(email: string, mot_de_passe: string): Promise<UtilisateurEntity | null> {
        const utilisateur = await this.utilisateurRepository.findOne({ where: { email } }); // Cherche l'utilisateur par email
        
        if (!utilisateur) {
            return null; // Retourne null si l'utilisateur n'est pas trouvé
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe); // Compare le mot de passe envoyé avec celui en base

        if (isPasswordValid) {
            return utilisateur; // Retourne l'utilisateur si le mot de passe est correct
        }

        return null; // Retourne null si le mot de passe est incorrect
    }

    // Génère un JWT pour l'utilisateur
    async generateJwt(user: UtilisateurEntity): Promise<string> {
        const payload = { id: user.id, prenom: user.prenom, nom: user.nom, admin: user.admin }; // Crée le payload avec les informations de l'utilisateur
        return this.jwtService.sign(payload); // Crée et retourne le JWT signé
    }

    // Méthode pour récupérer un utilisateur par son email
    async findByEmail(email: string): Promise<UtilisateurEntity> {
        return this.utilisateurRepository.findOne({ where: { email } }); // Récupère l'utilisateur en fonction de son email
    }

    // Méthode pour récupérer tous les utilisateurs
    async getUserList(): Promise<UtilisateurEntity[]> {
        return await this.utilisateurRepository.find(); // Récupère la liste complète des utilisateurs
    }

    // Méthode pour récupérer tous les utilisateurs sauf celui passé en paramètre
    async getOtherUsersList(id_user: number): Promise<UtilisateurEntity[]> {
        return await this.utilisateurRepository.find({
            where: { id: Not(id_user) } // Exclut l'utilisateur avec l'ID spécifié
        });
    }

    // Méthode pour récupérer tous les utilisateurs qui ne sont pas associés à un projet donné
    async getUsersNotInProjet(id_projet: number): Promise<UtilisateurEntity[]> {
        return await this.utilisateurRepository
            .createQueryBuilder("user")
            .where("user.id NOT IN (SELECT up.id_utilisateur FROM utilisateur_projet up WHERE up.id = :id_projet)", { id_projet }) // Exclut les utilisateurs associés au projet
            .getMany();
    }
}
