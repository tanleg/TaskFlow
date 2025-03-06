import { Body, Controller, Post, Get, Res, Request, UnauthorizedException, UseGuards, Param } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { ConnexionDto } from './dto/connexion.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class UtilisateursController {
  constructor(private readonly UtilisateursService: UtilisateursService) {}

  // Endpoint pour la création d'un utilisateur
  @Post("creation")
  async create(@Body() createUtilisateursDto: CreateUtilisateurDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    // Appel du service pour créer l'utilisateur et générer un token d'accès
    const { accessToken } = await this.UtilisateursService.create(createUtilisateursDto);
    
    // Sauvegarde du token dans un cookie pour l'authentification future
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: true, // Utiliser HTTPS
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 heure
    });

    return { accessToken };
  }

  // Endpoint pour la connexion d'un utilisateur
  @Post('connexion')
  async login(@Body() loginDto: ConnexionDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string } | null> {
    const { email, mot_de_passe } = loginDto;
    // Validation de l'utilisateur avec ses identifiants
    const utilisateur = await this.UtilisateursService.validateUser(email, mot_de_passe);

    if (!utilisateur) {
      // Si l'utilisateur n'existe pas, renvoyer une exception d'autorisation
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Génération du token d'accès
    const accessToken = await this.UtilisateursService.generateJwt(utilisateur);

    // Sauvegarde du token dans un cookie
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: true, // Utiliser HTTPS
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 heure
    });

    return { accessToken };
  }

  // Endpoint pour récupérer les informations de l'utilisateur avec un token valide
  @UseGuards(JwtAuthGuard) // Protection de la route avec le JwtAuthGuard
  @Get('profile')
  getProfile(@Request() req): { id: number, prenom: string, nom: string, admin: boolean } {
    const user = req.user; // Récupération des données de l'utilisateur depuis la requête
    return { id: user.id, prenom: user.prenom, nom: user.nom, admin: user.admin }; // Retourne les informations de l'utilisateur
  }

  // Endpoint pour récupérer la liste de tous les utilisateurs
  @Get('user')
  async getUser(): Promise<UtilisateurEntity[]> {
    return this.UtilisateursService.getUserList();
  }

  // Endpoint pour récupérer la liste des utilisateurs sauf celui dont l'id est passé en paramètre
  @Get('otherusers/:id')
  async getOtherUsers(@Param('id') id: number): Promise<UtilisateurEntity[]> {
    return this.UtilisateursService.getOtherUsersList(id);
  }

  // Endpoint pour récupérer la liste des utilisateurs qui ne sont pas dans un projet donné
  @Get('usersnotinprojet/:id')
  async getUsersNotInProjet(@Param('id') id: number): Promise<UtilisateurEntity[]> {
    return this.UtilisateursService.getUsersNotInProjet(id);
  }
}
