import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TacheEntity } from 'src/entities/tache.entity';
import { JalonEntity } from 'src/entities/jalon.entity';
import { LivrableEntity } from 'src/entities/livrable.entity';
import { UtilisateurJalonEntity } from 'src/entities/utilisateur_jalon.entity';
import { UtilisateurLivrableEntity } from 'src/entities/utilisateur_livrable.entity';
import { CreateJalonDto } from './dto/create-jalon.dto';
import { CreateLivrableDto } from './dto/create-livrable.dto';
import { CreateTacheDto } from './dto/create-tache.dto';
import { UtilisateurProjetEntity } from 'src/entities/utilisateur_projet.entity';
import { UtilisateurEntity } from 'src/entities/utilisateur.entity';

@Injectable()
export class EvenementsService {
    constructor(
        @InjectRepository(TacheEntity)
        private readonly tacheRepository: Repository<TacheEntity>,

        @InjectRepository(JalonEntity)
        private readonly jalonRepository: Repository<JalonEntity>,

        @InjectRepository(UtilisateurJalonEntity)
        private readonly utilisateurJalonRepository: Repository<UtilisateurJalonEntity>,
        
        @InjectRepository(LivrableEntity)
        private readonly livrableRepository: Repository<LivrableEntity>,
    
        @InjectRepository(UtilisateurLivrableEntity)
        private readonly utilisateurLivrableRepository: Repository<UtilisateurLivrableEntity>,
    
        @InjectRepository(UtilisateurProjetEntity)
        private readonly utilisateurProjetRepository: Repository<UtilisateurProjetEntity>,

        @InjectRepository(UtilisateurEntity)
        private readonly utilisateurRepository: Repository<UtilisateurEntity>,
    ) {}


    async createJalon(createJalonDto: CreateJalonDto) {

        const jalon = this.jalonRepository.create({
          nom: createJalonDto.nom,
          date_fin: createJalonDto.date_fin,
          projet: { id: createJalonDto.id_projet },
        });

        const savedJalon = await this.jalonRepository.save(jalon);
      
        const utilisateursDuProjet = await this.utilisateurProjetRepository.find({
            where: { projet: { id: createJalonDto.id_projet } },
        });
    
        const utilisateurJalons = utilisateursDuProjet.map(utilisateur => {
            return this.utilisateurJalonRepository.create({
                jalon: { id: savedJalon.id },
                utilisateur: { id: utilisateur.id_utilisateur },
            });
        });
    
        await this.utilisateurJalonRepository.save(utilisateurJalons);
    
        return savedJalon;
    }

    async createLivrable(createLivrableDto: CreateLivrableDto) {

        const livrable = this.livrableRepository.create({
          nom: createLivrableDto.nom,
          date_fin: createLivrableDto.date_fin,
          date_fin_reelle: null,
          termine: false,
          projet: { id: createLivrableDto.id_projet },
        });

        const savedLivrable = await this.livrableRepository.save(livrable);
      
        const utilisateursDuProjet = await this.utilisateurProjetRepository.find({
            where: { projet: { id: createLivrableDto.id_projet } },
        });
    
        const utilisateurLivrables = utilisateursDuProjet.map(utilisateur => {
            return this.utilisateurLivrableRepository.create({
                livrable: { id: savedLivrable.id },
                utilisateur: { id: utilisateur.id_utilisateur },
            });
        });
    
        await this.utilisateurLivrableRepository.save(utilisateurLivrables);
    
        return savedLivrable;
    } 

    async createTache(createTacheDto: CreateTacheDto) {

        const tache = this.tacheRepository.create({
          nom: createTacheDto.nom,
          date_debut: createTacheDto.date_debut,
          date_fin_reelle: null,
          date_fin: createTacheDto.date_fin,
          termine: false,
          projet: { id: createTacheDto.id_projet },
          utilisateur: { id: createTacheDto.id_utilisateur },
        });

        return await this.tacheRepository.save(tache);
    }

    async getTachesForUtilisateur(userId: number): Promise<TacheEntity[]> {
        return this.tacheRepository.find({
          where: { utilisateur: { id: userId } },
          relations: ['utilisateur', 'projet'],
        });
    }

    async getJalonsForUtilisateur(utilisateurId: number): Promise<JalonEntity[]> {
        const utilisateurJalons = await this.utilisateurJalonRepository.find({
          where: { utilisateur: { id: utilisateurId } },
          relations: ['jalon'],
        });
    
        return utilisateurJalons.map((utilisateurJalon) => utilisateurJalon.jalon);
    }

    async getLivrablesForUtilisateur(utilisateurId: number): Promise<LivrableEntity[]> {
        const utilisateurLivrables = await this.utilisateurLivrableRepository.find({
            where: { utilisateur: { id: utilisateurId } },
            relations: ['livrable'],
        });

        return utilisateurLivrables.map((utilisateurLivrable) => utilisateurLivrable.livrable);
    }

    // Liste les 5 prochains evenements pour un utilisateur
    async get5PremiersEvenements(userId: number): Promise<any[]> {
        // Récupérer les tâches
        const taches = await this.getTachesForUtilisateur(userId);
        const tachesWithType = taches.map(tache => ({
            ...tache,
            type: 'Tâche',
        }));

        // Récupérer les jalons
        const jalons = await this.getJalonsForUtilisateur(userId);
        const jalonsWithType = jalons.map(jalon => ({
            ...jalon,
            type: 'Jalon',
        }));

        // Récupérer les livrables
        const livrables = await this.getLivrablesForUtilisateur(userId);
        const livrablesWithType = livrables.map(livrable => ({
            ...livrable,
            type: 'Livrable',
        }));

        // Combiner tous les événements
        const allEvenements = [...tachesWithType, ...jalonsWithType, ...livrablesWithType];

        // Si aucun événement n'est trouvé, renvoyer un tableau vide
        if (allEvenements.length === 0) {
            return [];
        }

        // Trier par date de fin
        allEvenements.sort((a, b) => a.date_fin.getTime() - b.date_fin.getTime());

        // Renvoyer les 5 premiers événements
        return allEvenements.slice(0, 5);
    }
    

    // async getTachesDansProjet(ProjetId: number): Promise<TacheEntity[]> {
    //     const taches = await this.tacheRepository.find({
    //         where: { 
    //             projet: { id: ProjetId }
    //         },
    //       relations: ['utilisateur', 'projet'],
    //     });

    //     return taches.sort((a, b) => a.date_debut.getTime() - b.date_debut.getTime());

    // }


    async getTachesDansProjet(ProjetId: number): Promise<TacheEntity[]> {
        const taches = await this.tacheRepository.find({
            where: { 
                projet: { id: ProjetId }
            },
            relations: ['utilisateur', 'projet'],
        });
    
        return taches
            .map(tache => ({
                ...tache,
                utilisateur: tache.utilisateur ? tache.utilisateur : null // Assure que c'est bien `null` si non défini
            }))
            .sort((a, b) => a.date_debut.getTime() - b.date_debut.getTime());
    }
    

    async getJalonsDansProjet(projetId: number): Promise<JalonEntity[]> {
        const utilisateurJalons = await this.utilisateurJalonRepository.find({
            where: {
                jalon: { projet: { id: projetId } }
            },
            relations: ['jalon', 'jalon.projet']
        });
    
        return utilisateurJalons.map((utilisateurJalon) => utilisateurJalon.jalon);
    }
    

    async getLivrablesDansProjet(projetId: number): Promise<LivrableEntity[]> {
        const utilisateurLivrables = await this.utilisateurLivrableRepository.find({
            where: {
                livrable: { projet: { id: projetId } }
            },
            relations: ['livrable', 'livrable.projet']
        });
    
        return utilisateurLivrables.map((utilisateurJalon) => utilisateurJalon.livrable);
    }


    // Liste les prochains evenements pour un utilisateur dans un projet
    async getProchainsEvenementsDuProjet(ProjetId: number): Promise<any[]> {
        // Récupérer les tâches
        const taches = await this.getTachesDansProjet(ProjetId);
        const tachesWithType = taches.map(tache => ({
            ...tache,
            type: 'Tâche',
        }));

        // Récupérer les jalons
        const jalons = await this.getJalonsDansProjet(ProjetId);
        const jalonsWithType = jalons.map(jalon => ({
            ...jalon,
            type: 'Jalon',
        }));

        // Récupérer les livrables
        const livrables = await this.getLivrablesDansProjet(ProjetId);
        const livrablesWithType = livrables.map(livrable => ({
            ...livrable,
            type: 'Livrable',
        }));

        // Combiner tous les événements
        const allEvenements = [...tachesWithType, ...jalonsWithType, ...livrablesWithType];

        // Si aucun événement n'est trouvé, renvoyer un tableau vide
        if (allEvenements.length === 0) {
            return [];
        }
        return allEvenements
    }

    async updateUtilisateurAssigneAUneTache(id_tache: number, id_utilisateur_assigne: number): Promise<TacheEntity> {
        
        const tache = await this.tacheRepository.findOne({ where: { id: id_tache } });
    
        if (!tache) {
            throw new Error(`Pas de tache avec l'id ${id_tache}`);
        }
    
        const utilisateur = await this.utilisateurRepository.findOne({ where: { id: id_utilisateur_assigne } });

        if (!utilisateur) {
            throw new Error(`Pas d'utilisateur avec l'id ${id_utilisateur_assigne}`);
        }

        tache.utilisateur = utilisateur;
    
        return await this.tacheRepository.save(tache);
    }


    async changerStatutTache(id_tache: number) {
        
        const tache = await this.tacheRepository.findOne({ where: { id: id_tache } });
    
        if (!tache) {
            throw new Error(`Pas de tache avec l'id ${id_tache}`);
        }
    
        tache.termine = tache.termine ? false : true;
    
        return await this.tacheRepository.save(tache);
    }


    async changerStatutLivrable(id_livrable: number) {
        
        const livrable = await this.livrableRepository.findOne({ where: { id: id_livrable } });
    
        if (!livrable) {
            throw new Error(`Pas de livrable avec l'id ${id_livrable}`);
        }
    
        livrable.termine = livrable.termine ? false : true;
    
        return await this.livrableRepository.save(livrable);
    }
    
}
