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

  // Fonction pour obtenir la prochaine version du fichier
  async getNextVersion(nom: string, id_projet: number): Promise<number> {
    const existingFiles = await this.fichierRepository.find({
      where: { nom, projet: { id: id_projet } },
    });
    return existingFiles.length > 0
      ? Math.max(...existingFiles.map((f) => f.version)) + 1
      : 1;
  }

  // Créer un nouveau fichier
  async create(createFichierDto: CreateFichierDto, url: string): Promise<FichierEntity> {
    const { nom, id_projet, id_utilisateur } = createFichierDto;

    // Générer la version du fichier (attendre la réponse de getNextVersion)
    const nextVersion = await this.getNextVersion(nom, id_projet);

    // Récupérer les entités projet et utilisateur à partir des id
    const projet = await this.projetRepository.findOne({ where: { id: id_projet } });
    const utilisateur = await this.utilisateurRepository.findOne({ where: { id: id_utilisateur } });

    if (!projet || !utilisateur) {
      throw new Error('Projet ou utilisateur introuvable');
    }

    // Créer et sauvegarder le fichier
    const fichier = this.fichierRepository.create({
      nom,
      url,
      projet, // Entité projet
      utilisateur, // Entité utilisateur
      date_upload: new Date(),
      version: nextVersion,
    });

    return this.fichierRepository.save(fichier);
  }
}
