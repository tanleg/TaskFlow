import { Controller, Post, Body, Request, Get, Param, NotFoundException, Res, UseGuards } from '@nestjs/common';
import { PartenaireService } from '../partenaires/partenaire.service';
import { PartenaireEntity } from '../entities/partenaire.entity';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('partenaire')
export class PartenaireController {
  constructor(private readonly partenaireService: PartenaireService) {}

  // Route pour ajouter un partenaire
  @Post('add')
  async addPartenaire(
    @Body() body: { nom: string; prenom: string; email: string; entreprise: string; projetId: number },
  ): Promise<PartenaireEntity> {
    return this.partenaireService.createPartenaire(
      body.nom,
      body.prenom,
      body.email,
      body.entreprise,
      body.projetId,
    );
  }

  // Route pour récupérer un partenaire avec un token
  @Get('access/:token')
  async getPartenaireByToken(@Param('token') token: string): Promise<PartenaireEntity> {
    const partenaire = await this.partenaireService.findByToken(token);
    if (!partenaire) {
      throw new NotFoundException('Lien invalide ou expiré');
    }
    return partenaire;
  }

  // Route pour récupérer le profil de l'utilisateur connecté
  @UseGuards(JwtAuthGuard)
  @Get('profile-jwt')
  getJwtProfile(@Request() req): { id: number, prenom: string, nom: string, admin: boolean } {
    const partenaire = req.user;
    return { id: partenaire.id, prenom: partenaire.prenom, nom: partenaire.nom, admin: partenaire.admin };
  }

  // Route pour connecter un partenaire via un token
  @Post('connexion/:token')
  async login(@Param('token') token: string, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string } | null> {
    const partenaire = await this.partenaireService.validatePartenaire(token);
    const accessToken = await this.partenaireService.generateJwt(partenaire);

    res.cookie('authToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600 * 1000, // 1 heure
    });

    return { accessToken };
  }
}
