import { Controller, Post, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { ProjetService } from './projet.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';
import { AjoutSupprUtilisateurProjetDto } from './dto/ajout-suppr-utilisateur-projet.dto';

@Controller('projets')
export class ProjetController {
  // Injecte le service projet pour les opérations métier
  constructor(private readonly projetService: ProjetService) {}

  // Route pour créer un projet et l'associer à un utilisateur
  @Post('create')
  async create(
    @Body() createProjectDto: CreateProjectDto, // Reçoit les données du projet à créer
    @Body('utilisateurId') utilisateurId: number, // Reçoit l'ID de l'utilisateur à associer
  ): Promise<ProjetEntity> {
    return this.projetService.create(createProjectDto, utilisateurId);
  }

  // Route pour ajouter un utilisateur à un projet
  @Post('ajouter/utilisateur')
  async ajoutUtilisateurProjet(@Body() ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto) {
    return await this.projetService.ajouterUtilisateurProjet(ajoutSupprUtilisateurProjetDto);
  }

  // Route pour supprimer un utilisateur d'un projet
  @Delete('supprimer/utilisateur')
  async supprimerUtilisateurDuProjet(@Body() ajoutSupprUtilisateurProjetDto: AjoutSupprUtilisateurProjetDto) {
    return await this.projetService.supprUtilisateurProjet(ajoutSupprUtilisateurProjetDto);
  }

  // Route pour obtenir les projets associés à un chercheur
  @Get('display/chercheur/:id')
  async getProjetsChercheur(@Param('id') utilisateurId: number) {
    const projets = await this.projetService.liste_projets_chercheur(utilisateurId);
    return projets;
  }

  // Route pour obtenir les projets associés à un partenaire
  @Get('display/partenaire/:id')
  async getProjetsPartenaire(@Param('id') utilisateurId: number) {
    const projets = await this.projetService.liste_projets_partenaire(utilisateurId);
    return projets;
  }

  // Route pour récupérer tous les projets publics
  @Get('public')
  async findAllProjetsPublics(): Promise<ProjetEntity[]> {
    return this.projetService.getProjetsPublics();
  }
  
  // Route pour récupérer tous les projets
  @Get('display')
  async findAll(): Promise<ProjetEntity[]> {
    return this.projetService.findAll();
  }

  // Route pour obtenir la liste des utilisateurs d'un projet
  @Get('/:id/users')
  async findUtilisateursDeProjet(@Param('id') projet_id: number): Promise<any[]> {
    return this.projetService.findUtilisateursDeProjet(projet_id);
  }

  // Route pour déclarer un utilisateur comme chef de projet
  @Put(':id_projet/users/:id_user/make-admin')
  async declarerChef(@Param('id_user') id_user: number, @Param('id_projet') id_projet: number) {
    return this.projetService.declarerChef(id_user, id_projet);
  }

  // Route pour enlever un utilisateur de son rôle de chef de projet
  @Put(':id_projet/users/:id_user/deprive-admin')
  async enleverChef(@Param('id_user') id_user: number, @Param('id_projet') id_projet: number) {
    return this.projetService.enleverChef(id_user, id_projet);
  }

  // Route pour vérifier si un utilisateur est chef de projet
  @Get(':id_projet/:id_utilisateur/chef')
  async isChef(@Param('id_projet') id_projet: number, @Param('id_utilisateur') id_utilisateur: number): Promise<{ chef: boolean }> {
    const chef = await this.projetService.isChef(id_projet, id_utilisateur);
    return { chef };
  }
}
