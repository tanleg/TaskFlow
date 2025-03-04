import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FichierEntity } from 'src/entities/fichier.entity';
import { Repository } from 'typeorm';
import { CreateFichierDto } from './dto/create-fichier.dto';
import { ProjetEntity } from 'src/entities/projet.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FichiersService {
  constructor(
    @InjectRepository(FichierEntity)
    private readonly fichierRepository: Repository<FichierEntity>,
    @InjectRepository(ProjetEntity)
    private readonly projetRepository: Repository<ProjetEntity>
  ) {}

  // Récupérer tous les fichiers par ID de projet
  async getFilesByProjectId(idProjet: number): Promise<FichierEntity[]> {
    return this.fichierRepository.find({
      where: { projet: { id: idProjet } },
      relations: ['projet'],
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
    const { nom, id_projet, upload_par } = createFichierDto;
    const projet = await this.projetRepository.findOne({ where: { id: id_projet } });

    if (!projet) {
      throw new Error('Projet introuvable');
    }

    // Récupérer la version suivante pour le fichier
    const nextVersion = await this.getNextVersion(nom, id_projet);

    // // Créer et sauvegarder le fichier
    const fichier = this.fichierRepository.create({
        nom,
        url,
        projet,
        upload_par,
        date_upload: new Date(),
        version: nextVersion,
        });

    return this.fichierRepository.save(fichier);
  }


  async supprFichier(id_projet: number, filename: string, version: number): Promise<void> {
    try {
        let versionedFilename: string;
        const lastDotIndex = filename.lastIndexOf('.');

        if (lastDotIndex === -1) {
            versionedFilename = `${filename}_v${version}`;
        } else {
            const name = filename.substring(0, lastDotIndex);
            const extension = filename.substring(lastDotIndex);
            versionedFilename = `${name}_v${version}${extension}`;
        }

        const filePath = path.join(process.cwd(), 'src', 'fichiers', 'fichiers_storage', String(id_projet), versionedFilename);

        const deleteResult = await this.fichierRepository.delete({
            id_projet: id_projet,
            nom: filename,
            version: version
        });

        if (deleteResult.affected === 0) {
            throw new Error('Aucun fichier correspondant trouvé en base de données.');
        }

        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`Fichier supprimé : ${versionedFilename} (Version: ${version}, Projet: ${id_projet})`);
        } catch (fsError) {
            console.warn(`Le fichier ${versionedFilename} n'existe pas ou a déjà été supprimé.`);
        }

    } catch (error) {
        console.error('Erreur lors de la suppression du fichier :', error);
        throw new Error('Échec de la suppression du fichier.');
    }
}

}
