import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly utilisateurRepository: Repository<UtilisateurEntity>,
  ) {}

  async create(createUtilisateurDto: CreateUtilisateurDto): Promise<UtilisateurEntity> {
    const utilisateur = this.utilisateurRepository.create(createUtilisateurDto);
    return this.utilisateurRepository.save(utilisateur);
  }

  // Méthode pour récupérer un utilisateur par email
  async findByEmail(email: string): Promise<UtilisateurEntity> {
    return this.utilisateurRepository.findOne({ where: { email } });
  }
}
