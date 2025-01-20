import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FichierEntity } from 'src/entities/fichier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FichiersService {
    constructor(
        @InjectRepository(FichierEntity)
        private readonly fichierRepository: Repository<FichierEntity>,
      ) {}
// Récupérer tous les fichiers par ID de projet
async getFilesByProjectId(idProjet: number): Promise<FichierEntity[]> {
    return this.fichierRepository.find({
      where: { projet: { id: idProjet } },
      //relations: ['projet', 'utilisateur', 'partenaire'], // Charger les relations si nécessaire
    });
  }
}