import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TacheEntity } from 'src/entities/tache.entity';
import { JalonEntity } from 'src/entities/jalon.entity';
import { LivrableEntity } from 'src/entities/livrable.entity';
import { UtilisateurJalonEntity } from 'src/entities/utilisateur_jalon.entity';
import { UtilisateurLivrableEntity } from 'src/entities/utilisateur_livrable.entity';
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
    ) {}

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
    async get5ProchainsEvenements(userId: number): Promise<any[]> {
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
    
}
