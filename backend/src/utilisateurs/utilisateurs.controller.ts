import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { ConnexionDto } from './dto/connexion.dto';


@Controller('auth')
export class UtilisateursController {
  constructor(private readonly UtilisateursService: UtilisateursService) {}

  @Post("creation")
  async create(@Body() createUtilisateursDto: CreateUtilisateurDto): Promise<UtilisateurEntity> {
    return this.UtilisateursService.create(createUtilisateursDto);
  }

  @Post('connexion')
  async login(@Body() loginDto: ConnexionDto): Promise<{ accessToken: string } | null> {
    const { email, mot_de_passe } = loginDto;
    const utilisateur = await this.UtilisateursService.validateUser(email, mot_de_passe);

    if (!utilisateur) {
      return null;
    }

    const accessToken = await this.UtilisateursService.generateJwt(utilisateur);
    return { accessToken };
  }


  // GET pour récupérer un utilisateur par son email
  //INUTILE pour l'instant
  @Get(':email')
  async getByEmail(@Param('email') email: string): Promise<UtilisateurEntity> {
    return this.UtilisateursService.findByEmail(email);
  }
}

