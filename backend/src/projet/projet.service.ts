import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { UtilisateurProjetEntity } from 'src/entities/utilisateur_projet.entity';
import { AjoutSupprUtilisateurProjetDto } from './dto/ajout-suppr-utilisateur-projet.dto';
import { PartenaireEntity } from 'src/entities/partenaire.entity';

@Injectable()
export class ProjetService {
    constructor(
        @InjectRepository(ProjetEntity)
        private readonly projetRepository: Repository<ProjetEntity>,

        @InjectRepository(UtilisateurProjetEntity)
        private readonly utilisateurProjetRepository: Repository<UtilisateurProjetEntity>,

        @InjectRepository(PartenaireEntity)
        private readonly partenaireRepository: Repository<PartenaireEntity>,
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
    
    async liste_projets_chercheur(utilisateurId: number) {
        const utilisateurProjets = await this.utilisateurProjetRepository.find({
          where: { id_utilisateur: utilisateurId },
          relations: ['projet']
        });
      return utilisateurProjets.map(up => up.projet);
    }

    async liste_projets_partenaire(partenaireId: number) {
        const partenaireProjets = await this.partenaireRepository.find({
            where: { id: partenaireId },
            relations: ['projet'], // Assure-toi que la relation est bien définie dans l'entité Partenaire
        });
        return partenaireProjets.map(partenaire => partenaire.projet);
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

    async ajouterUtilisateurProjet(ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto): Promise<{ message: string }> {
        const { id, id_utilisateur } = ajoutSupprUtilisateurProjetDto;

        const ajt_utilisateur = this.utilisateurProjetRepository.create({
            utilisateur: { id: id_utilisateur },
            projet: { id: id },
            chef: false,
            visiteur: false
        });
    
        await this.utilisateurProjetRepository.save(ajt_utilisateur);
    
        return { message: 'Utilisateur ajouté au projet' };
    }

    async supprUtilisateurProjet(ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto): Promise<{ message: string }> {
        const { id, id_utilisateur } = ajoutSupprUtilisateurProjetDto;
        
        const utilisateurProjet = await this.utilisateurProjetRepository.findOne({
          where: {
            utilisateur: { id: id_utilisateur },
            projet: { id: id },
          },
        });
    
        if (!utilisateurProjet) {
          throw new NotFoundException('Utilisateur non trouvé dans ce projet.');
        }

        // supprime l'association de l'user à un jalon
        await this.utilisateurProjetRepository.query(`
            DELETE FROM utilisateur_jalon
            USING jalon
            WHERE utilisateur_jalon.id_utilisateur = $1
            AND utilisateur_jalon.id = (
                SELECT id
                FROM jalon
                WHERE id_projet = $2
            );
        `, [id_utilisateur, id]);

        // supprime l'association de l'user à un livrable
        await this.utilisateurProjetRepository.query(`
            DELETE FROM utilisateur_livrable
            USING livrable
            WHERE utilisateur_livrable.id_utilisateur = $1
            AND utilisateur_livrable.id = (
                SELECT id
                FROM livrable
                WHERE id_projet = $2
            );
        `, [id_utilisateur, id]);

        // supprime l'association de l'user à une tache en remplacant l'id_utilisateur par NULL
        await this.utilisateurProjetRepository.query(`
            UPDATE tache
            SET id_utilisateur = null
            WHERE id_utilisateur = $1
            AND id_projet = $2;
        `, [id_utilisateur, id]);

        // vire l'user du projet
        await this.utilisateurProjetRepository.remove(utilisateurProjet);
    
        return { message: 'Utilisateur supprimé du projet avec succès.' };
    }
    
    async findUtilisateursDeProjet(id_projet: number): Promise<any[]> {
        const utilisateurProjets = await this.utilisateurProjetRepository.find({
            where: { projet: { id: id_projet } }, // Filtrer par projet
            relations: ['utilisateur', 'projet'], // Inclure les relations nécessaires
        });
    
        return utilisateurProjets.map((utilisateurProjet) => ({
            utilisateur: utilisateurProjet.utilisateur,
            chef: utilisateurProjet.chef,
            visiteur: utilisateurProjet.visiteur,
        }));
    }

    async declarerChef(id_user: number, id_projet: number) {
        this.utilisateurProjetRepository.update(
          { id: id_projet, id_utilisateur: id_user },
          { chef: true }
        );
    }

    async enleverChef(id_user: number, id_projet: number) {
        this.utilisateurProjetRepository.update(
          { id: id_projet, id_utilisateur: id_user },
          { chef: false }
        );
    }

    async isChef(id_projet: number, id_utilisateur: number): Promise<boolean> {
        const utilisateurProjet = await this.utilisateurProjetRepository.findOne({
          where: { id: id_projet, id_utilisateur },
        });
    
        return utilisateurProjet ? utilisateurProjet.chef : false;
    }
}
