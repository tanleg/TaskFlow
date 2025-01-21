import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { ProjetService } from './projet.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { AjoutUtilisateurProjetDto } from './dto/ajout-utilisateur-projet.dto';

@Controller('projets')
export class ProjetController {
  constructor(private readonly projetService: ProjetService) {}

  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto, @Body('utilisateurId') utilisateurId: number): Promise<ProjetEntity> {
    return this.projetService.create(createProjectDto, utilisateurId);
  }

  @Post('ajouter/utilisateur')
  async ajoutUtilisateurProjet(@Body() ajoutUtilisateurProjetDto: AjoutUtilisateurProjetDto) {
    return await this.projetService.ajouterUtilisateurProjet(ajoutUtilisateurProjetDto);
  }

  @Delete('supprimer/utilisateur')
  async supprimerUtilisateurDuProjet(@Body() ajoutUtilisateurProjetDto: AjoutUtilisateurProjetDto) {
    const { id, id_utilisateur } = ajoutUtilisateurProjetDto; 
    return await this.projetService.supprUtilisateurProjet(id_utilisateur, id);
  }

  @Get('display/:id')
  async getProjets(@Param('id') utilisateurId: number) {
    const projets = await this.projetService.liste_projets(utilisateurId);
    return projets;
  }

  @Get('public')
  async findAllProjetsPublics(): Promise<ProjetEntity[]> {
    return this.projetService.getProjetsPublics();
  }
  
  @Get('display')
  async findAll(): Promise<ProjetEntity[]> {
    return this.projetService.findAll();
  }

}
