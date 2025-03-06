import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartenaireEntity } from '../entities/partenaire.entity';
import { ProjetEntity } from '../entities/projet.entity';
import { EntrepriseEntity } from '../entities/entreprise.entity';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PartenaireService {
  constructor(
    @InjectRepository(PartenaireEntity)
    private readonly partenaireRepository: Repository<PartenaireEntity>,

    @InjectRepository(ProjetEntity)
    private readonly projetRepository: Repository<ProjetEntity>,

    @InjectRepository(EntrepriseEntity)
    private readonly entrepriseRepository: Repository<EntrepriseEntity>,

    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  // Crée un partenaire après avoir vérifié l'existence du projet et de l'entreprise
  async createPartenaire(
    nom: string,
    prenom: string,
    email: string,
    entrepriseNom: string,
    projetId: number,
  ): Promise<PartenaireEntity> {
    // Vérifie si le projet existe
    const projet = await this.projetRepository.findOne({ where: { id: projetId } });
    if (!projet) {
      throw new NotFoundException(`Projet avec ID ${projetId} non trouvé`);
    }

    // Vérifie si l'entreprise existe, sinon la crée
    let entreprise = await this.entrepriseRepository.findOne({ where: { entreprise: entrepriseNom } });
    if (!entreprise) {
      entreprise = this.entrepriseRepository.create({ entreprise: entrepriseNom });
      await this.entrepriseRepository.save(entreprise);
    }

    // Génère un lien d'accès unique avec un token
    const token = uuidv4();
    const urlSite = this.configService.get<string>('URL_SITE');
    const accessLink = `${urlSite}/access/${token}`;

    // Crée et sauvegarde le partenaire
    const partenaire = this.partenaireRepository.create({
      nom,
      prenom,
      email,
      entreprise,
      projet,
      token,
      lien: accessLink,
    });

    return this.partenaireRepository.save(partenaire);
  }

  // Trouve un partenaire par son token
  async findByToken(token: string): Promise<PartenaireEntity | null> {
    return this.partenaireRepository.findOne({
      where: { token },
      relations: ['projet', 'entreprise']
    });
  }
  
  // Génère un JWT pour un partenaire
  async generateJwt(partenaire: PartenaireEntity): Promise<string> {
    const payload = { id: partenaire.id, prenom: partenaire.prenom, nom: partenaire.nom, admin: false };
    return this.jwtService.sign(payload);
  }

  // Valide un partenaire par son token
  async validatePartenaire(token: string): Promise<PartenaireEntity | null> {
    const partenaire = await this.partenaireRepository.findOne({ where: { token } });
    
    if (!partenaire) {
      return null;
    }

    return partenaire;
  }
}
