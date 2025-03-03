import { Controller, Post, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { ProjetService } from './projet.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { AjoutSupprUtilisateurProjetDto } from './dto/ajout-suppr-utilisateur-projet.dto';

@Controller('projets')
export class ProjetController {
  constructor(private readonly projetService: ProjetService) {}

  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto, @Body('utilisateurId') utilisateurId: number): Promise<ProjetEntity> {
    return this.projetService.create(createProjectDto, utilisateurId);
  }

  @Post('ajouter/utilisateur')
  async ajoutUtilisateurProjet(@Body() ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto) {
    return await this.projetService.ajouterUtilisateurProjet(ajoutSupprUtilisateurProjetDto);
  }

  @Delete('supprimer/utilisateur')
  async supprimerUtilisateurDuProjet(@Body() ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto) {
    return await this.projetService.supprUtilisateurProjet(ajoutSupprUtilisateurProjetDto);
  }

  @Get('display/chercheur/:id')
  async getProjetsChercheur(@Param('id') utilisateurId: number) {
    const projets = await this.projetService.liste_projets_chercheur(utilisateurId);
    return projets;
  }

  @Get('display/partenaire/:id')
  async getProjetsPartenaire(@Param('id') utilisateurId: number) {
    const projets = await this.projetService.liste_projets_partenaire(utilisateurId);
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

  @Get('/:id/users')
  async findUtilisateursDeProjet(@Param('id') projet_id: number): Promise<any[]> {
    return this.projetService.findUtilisateursDeProjet(projet_id);
  }

  @Put(':id_projet/users/:id_user/make-admin')
  async declarerChef(@Param('id_user') id_user: number, @Param('id_projet') id_projet: number) {
    return this.projetService.declarerChef(id_user, id_projet);
  }

  @Put(':id_projet/users/:id_user/deprive-admin')
  async enleverChef(@Param('id_user') id_user: number, @Param('id_projet') id_projet: number) {
    return this.projetService.enleverChef(id_user, id_projet);
  }

  @Get(':id_projet/:id_utilisateur/chef')
  async isChef(@Param('id_projet') id_projet: number, @Param('id_utilisateur') id_utilisateur: number): Promise<{ chef: boolean }> {
    const chef = await this.projetService.isChef(id_projet, id_utilisateur);
    return { chef };
  }
}
