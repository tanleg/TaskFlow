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
        private readonly utilisateurRepository: Repository<UtilisateurEntity>,
        private readonly jwtService: JwtService,
    ) {}


    // creer un utilisateur en bdd 
    async create(createUtilisateurDto: CreateUtilisateurDto): Promise<{ accessToken: string }> {

        const hashedPassword = await bcrypt.hash(createUtilisateurDto.mot_de_passe, 10);
        const utilisateur = this.utilisateurRepository.create({
            nom: createUtilisateurDto.nom,
            prenom: createUtilisateurDto.prenom,
            email: createUtilisateurDto.email,
            mot_de_passe: hashedPassword,
            telephone: createUtilisateurDto.telephone,
            admin: createUtilisateurDto.admin,
        });
    
        const savedUser = await this.utilisateurRepository.save(utilisateur);
        const accessToken = await this.generateJwt(savedUser);
    
        return { accessToken };
    }

    // checker les infos de connection d'un utilisateur
    async validateUser(email: string, mot_de_passe: string): Promise<UtilisateurEntity | null> {
        const utilisateur = await this.utilisateurRepository.findOne({ where: { email } });
        
        if (!utilisateur) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);

        if (isPasswordValid) {
            return utilisateur;
        }

        return null;
    }


    // Générer un JWT pour l'utilisateur connecté
    async generateJwt(user: UtilisateurEntity): Promise<string> {
        const payload = { id: user.id, prenom: user.prenom, nom: user.nom, admin: user.admin };
        return this.jwtService.sign(payload); // Générer un jeton JWT
    }

    // Méthode pour récupérer un utilisateur par email
    // (pas encore utilisé)
    async findByEmail(email: string): Promise<UtilisateurEntity> {
        return this.utilisateurRepository.findOne({ where: { email } });
    }

    // Méthode pour récupérer la liste des utilisateurs
    async getUserList(): Promise<UtilisateurEntity[]> {
        return await this.utilisateurRepository.find(); // Récupère tous les utilisateurs
    }

    // Méthode pour récupérer la liste des utilisateurs sauf celui passé en parametre
    async getOtherUsersList(id_user: number): Promise<UtilisateurEntity[]> {
        return await this.utilisateurRepository.find({
            where: { id: Not(id_user)}
        });
    }

    // Méthode pour récupérer la liste des utilisateurs sauf ceux du projet passé en parametre
    async getUsersNotInProjet(id_projet: number): Promise<UtilisateurEntity[]> {
        return await this.utilisateurRepository
            .createQueryBuilder("user")
            .where("user.id NOT IN (SELECT up.id_utilisateur FROM utilisateur_projet up WHERE up.id = :id_projet)", { id_projet })
            .getMany();
    }
}
