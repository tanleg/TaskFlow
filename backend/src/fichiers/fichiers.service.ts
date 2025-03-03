import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FichierEntity } from 'src/entities/fichier.entity';
import { Repository } from 'typeorm';
import { CreateFichierDto } from './dto/create-fichier.dto';
import { ProjetEntity } from 'src/entities/projet.entity';
import { UtilisateurEntity } from 'src/entities/utilisateur.entity';

@Injectable()
export class FichiersService {
  constructor(
    @InjectRepository(FichierEntity)
    private readonly fichierRepository: Repository<FichierEntity>,
    @InjectRepository(ProjetEntity)
    private readonly projetRepository: Repository<ProjetEntity>,
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}

  // Récupérer tous les fichiers par ID de projet
  async getFilesByProjectId(idProjet: number): Promise<FichierEntity[]> {
    return this.fichierRepository.find({
      where: { projet: { id: idProjet } },
      relations: ['projet', 'utilisateur', 'partenaire'],
    });
  }

  // Fonction pour obtenir la prochaiane version du fichier
  async getNextVersion(nom: string, id_projet: number): Promise<number> {
    console.log(`Recherche de la prochaine version pour le fichier "${nom}" dans le projet ID=${id_projet}`);
    
    // Récupérer tous les fichiers du projet avec le même nom
    const existingFiles = await this.fichierRepository.find({
      where: {
        nom: nom,
        id_projet: id_projet  // Utiliser directement id_projet au lieu de projet.id
      }
    });
  
    console.log(`Nombre de fichiers trouvés: ${existingFiles.length}`);
    
    if (existingFiles.length > 0) {
      // Extraire toutes les versions
      const versions = existingFiles.map(fichier => fichier.version);
      console.log('Versions existantes:', versions);
      
      // Trouver la version maximum et incrémenter
      const nextVersion = Math.max(...versions) + 1;
      console.log(`Prochaine version: ${nextVersion}`);
      return nextVersion;
    } else {
      console.log('Aucun fichier existant, première version (1)');
      return 1; // Premier fichier avec ce nom dans ce projet
    }
  }

  // Créer un nouveau fichier
  async create(createFichierDto: CreateFichierDto, url: string): Promise<FichierEntity> {
    const { nom, id_projet, id_utilisateur } = createFichierDto;

    // Vérifier les entités projet et utilisateur
    const projet = await this.projetRepository.findOne({ where: { id: id_projet } });
    const utilisateur = await this.utilisateurRepository.findOne({ where: { id: id_utilisateur } });

    if (!projet || !utilisateur) {
      throw new Error('Projet ou utilisateur introuvable');
    }

    // Récupérer la version suivante pour le fichier
    const nextVersion = await this.getNextVersion(nom, id_projet);

    // Créer et sauvegarder le fichier
    const fichier = this.fichierRepository.create({
      nom,
      url,
      projet,
      utilisateur,
      date_upload: new Date(),
      version: nextVersion,
    });

    return this.fichierRepository.save(fichier);
  }
}
