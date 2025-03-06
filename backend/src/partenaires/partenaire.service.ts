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

  async createPartenaire(
    nom: string,
    prenom: string,
    email: string,
    entrepriseNom: string,
    projetId: number,
  ): Promise<PartenaireEntity> {
    // Vérifier si le projet existe
    const projet = await this.projetRepository.findOne({ where: { id: projetId } });
    if (!projet) {
      throw new NotFoundException(`Projet avec ID ${projetId} non trouvé`);
    }

    // Vérifier si l'entreprise existe, sinon la créer
    let entreprise = await this.entrepriseRepository.findOne({ where: { entreprise: entrepriseNom } });
    if (!entreprise) {
      entreprise = this.entrepriseRepository.create({ entreprise: entrepriseNom });
      await this.entrepriseRepository.save(entreprise);
    }

    // Générer un lien d’accès unique
    const token = uuidv4();
    const urlSite = this.configService.get<string>('URL_SITE');
    const accessLink = `${urlSite}/access/${token}`;

    // Créer le partenaire
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

  async findByToken(token: string): Promise<PartenaireEntity | null> {
    return this.partenaireRepository.findOne({
      where: { token },
      relations: ['projet', 'entreprise']
    });
  }
  
    async generateJwt(partenaire: PartenaireEntity): Promise<string> {
        const payload = { id: partenaire.id, prenom: partenaire.prenom, nom: partenaire.nom, admin: false };
        return this.jwtService.sign(payload);
    }

    async validatePartenaire(token: string): Promise<PartenaireEntity | null> {
        const partenaire = await this.partenaireRepository.findOne({ where: { token } });
            
        if (!partenaire) {
            return null;
        }
    
        return partenaire;
    }
}
