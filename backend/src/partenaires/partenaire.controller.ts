import { Controller, Post, Body, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { PartenaireService } from '../partenaires/partenaire.service';
import { PartenaireEntity } from '../entities/partenaire.entity';

@Controller('partenaire')
export class PartenaireController {
  constructor(private readonly partenaireService: PartenaireService) {}

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

  @Get('access/:token')
  async getPartenaireByToken(@Param('token') token: string): Promise<PartenaireEntity> {
    const partenaire = await this.partenaireService.findByToken(token);
    if (!partenaire) {
      throw new NotFoundException('Lien invalide ou expiré');
    }
    return partenaire;
  }

  @Get('profile')
  async getProfile(@Query('token') token: string): Promise<PartenaireEntity> {
    if (!token) {
      throw new NotFoundException('Token non fourni');
    }

    const partenaire = await this.partenaireService.findByToken(token);
    if (!partenaire) {
      throw new NotFoundException('Aucun partenaire trouvé avec ce token');
    }

    return partenaire;
  }
}
