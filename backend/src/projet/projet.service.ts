import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';

@Injectable()
export class ProjetService {
  constructor(
    @InjectRepository(ProjetEntity)
    private readonly projetRepository: Repository<ProjetEntity>,
  ) {}

  //Création d'un nouveau projet
  async create(createProjectDto: CreateProjectDto) {
    // Création d'un nouvel objet projet à partir du DTO
    const projet = this.projetRepository.create({
      nom: createProjectDto.nom,
      description: createProjectDto.description,
      statut: createProjectDto.statut,
      public: createProjectDto.public || false,
    });

    // Sauvegarde du projet dans la base de données
    const savedProjet = await this.projetRepository.save(projet);

    return savedProjet;
  }
  // Méthode pour récupérer tous les projets
  async findAll(): Promise<ProjetEntity[]> {
    return this.projetRepository.find();  
  }
 
}
