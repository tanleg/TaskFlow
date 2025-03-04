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

  @Post("creation")
  async create(@Body() createUtilisateursDto: CreateUtilisateurDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    
    const { accessToken } = await this.UtilisateursService.create(createUtilisateursDto);
    
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: true, // true si HTTPS
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 heure
    });

    return { accessToken };
  }  

  @Post('connexion')
  async login(@Body() loginDto: ConnexionDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string } | null> {
    const { email, mot_de_passe } = loginDto;
    const utilisateur = await this.UtilisateursService.validateUser(email, mot_de_passe);

    if (!utilisateur) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const accessToken = await this.UtilisateursService.generateJwt(utilisateur);

    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: true, // true si HTTPS
      sameSite: 'strict',
      maxAge: 3600 * 1000, // 1 heure
    });

    return { accessToken };
  }


//   recupere les infos du user avec le bon token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): { id: number, prenom: string, nom: string, admin: boolean } {
    const user = req.user;
    return { id: user.id, prenom: user.prenom, nom: user.nom, admin: user.admin };
  }

  
  // GET pour récupérer un utilisateur par son email
  //INUTILE pour l'instant
  // @Get(':email')
  // async getByEmail(@Param('email') email: string): Promise<UtilisateurEntity> {
  //   return this.UtilisateursService.findByEmail(email);
  // }

  // Endpoint pour récupérer la liste des utilisateurs
  @Get('user')
  async getUser(): Promise<UtilisateurEntity[]> {
    return this.UtilisateursService.getUserList();
  }

  // Endpoint pour récupérer la liste des utilisateurs sauf l'id passé en parametre
  @Get('otherusers/:id')
  async getOtherUsers(@Param('id') id: number): Promise<UtilisateurEntity[]> {
    return this.UtilisateursService.getOtherUsersList(id);
  }
  
  // Endpoint pour récupérer la liste des utilisateurs sauf ceux du projet passé en parametre
  @Get('usersnotinprojet/:id')
  async getUsersNotInProjet(@Param('id') id: number): Promise<UtilisateurEntity[]> {
    return this.UtilisateursService.getUsersNotInProjet(id);
  }
}