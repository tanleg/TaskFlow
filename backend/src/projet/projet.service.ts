import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { UtilisateurProjetEntity } from 'src/entities/utilisateur_projet.entity';

@Injectable()
export class ProjetService {
    constructor(
        @InjectRepository(ProjetEntity)
        private readonly projetRepository: Repository<ProjetEntity>,

        @InjectRepository(UtilisateurProjetEntity)
        private readonly utilisateurProjetRepository: Repository<UtilisateurProjetEntity>,
    ) {}

    // Création d'un nouveau projet
    async create(createProjectDto: CreateProjectDto, utilisateurId:number) {
        // Création d'un nouvel objet projet à partir du DTO
        const projet = this.projetRepository.create({
        nom: createProjectDto.nom,
        description: createProjectDto.description,
        date_creation: new Date(),
        public: createProjectDto.public || false,
        statut: "En cours", // statut en cours de base à la creation
        });
    
        const savedProjet = await this.projetRepository.save(projet);

        await this.utilisateurProjetRepository.save({
            id: savedProjet.id, // Relation avec le projet
            id_utilisateur: utilisateurId, // Relation avec l'utilisateur (assurez-vous que l'utilisateurId est valide)
            chef: true, // Définit cet utilisateur comme chef
            visiteur: false, // Il n'est pas visiteur ici
        });

        return savedProjet;
    }
    
    async liste_projets(utilisateurId: number) {
        const utilisateurProjets = await this.utilisateurProjetRepository.find({
          where: { id_utilisateur: utilisateurId },
          relations: ['projet']
        });
      return utilisateurProjets.map(up => up.projet);
    }
      
    // Méthode pour récupérer tous les projets
    async findAll(): Promise<ProjetEntity[]> {
        return this.projetRepository.find();  
    }
 
}
