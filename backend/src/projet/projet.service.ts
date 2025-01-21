import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { UtilisateurProjetEntity } from 'src/entities/utilisateur_projet.entity';
import { AjoutUtilisateurProjetDto } from './dto/ajout-utilisateur-projet.dto';

@Injectable()
export class ProjetService {
    constructor(
        @InjectRepository(ProjetEntity)
        private readonly projetRepository: Repository<ProjetEntity>,

        @InjectRepository(UtilisateurProjetEntity)
        private readonly utilisateurProjetRepository: Repository<UtilisateurProjetEntity>,
    ) {}

    async create(createProjectDto: CreateProjectDto, utilisateurId:number) {
        const projet = this.projetRepository.create({
        nom: createProjectDto.nom,
        description: createProjectDto.description,
        date_creation: new Date(),
        public: createProjectDto.public || false,
        statut: "En cours", // statut en cours de base à la creation
        });
    
        const savedProjet = await this.projetRepository.save(projet);

        await this.utilisateurProjetRepository.save({
            id: savedProjet.id,
            id_utilisateur: utilisateurId,
            chef: true,
            visiteur: false
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
 
    async getProjetsPublics(): Promise<ProjetEntity[]> {
        return this.projetRepository
            .createQueryBuilder('projet')
            .where('projet.public = :isPublic', { isPublic: true })
            .getMany();
    }

    async ajouterUtilisateurProjet(ajouterUtilisateurProjetDto: AjoutUtilisateurProjetDto): Promise<{ message: string }> {
        const { id, id_utilisateur } = ajouterUtilisateurProjetDto;

        const ajt_utilisateur = this.utilisateurProjetRepository.create({
            utilisateur: { id: id_utilisateur },
            projet: { id: id },
            chef: false,
            visiteur: false
        });
    
        await this.utilisateurProjetRepository.save(ajt_utilisateur);
    
        return { message: 'Utilisateur ajouté au projet' };
    }

    async supprUtilisateurProjet(utilisateurId: number, projetId: number): Promise<{ message: string }> {
        //
        //
        //  CA SUPPRIME L'UTILISATEUR D'UN PROJET, MAIS LES EVENEMENTS ASSOCIéS A L'UTILISATEUR ET AU PROJET RESTENT
        //  A CORRIGER
        //
        const utilisateurProjet = await this.utilisateurProjetRepository.findOne({
          where: {
            utilisateur: { id: utilisateurId },
            projet: { id: projetId },
          },
        });
    

        if (!utilisateurProjet) {
          throw new NotFoundException('Utilisateur non trouvé dans ce projet.');
        }
    
        await this.utilisateurProjetRepository.remove(utilisateurProjet);
    
        return { message: 'Utilisateur supprimé du projet avec succès.' };
    }
    
}
