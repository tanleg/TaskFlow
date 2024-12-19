import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EvenementsService } from './evenements.service';

@Controller('evenements')
export class EvenementsController {
  constructor(private readonly evenementsService: EvenementsService) {}

    // Liste les 5 prochains evenements pour un utilisateur
    @Get(':id_utilisateur')
    async getNextEvenements(@Param('id_utilisateur') id_utilisateur: number): Promise<any[]> {
        try {
            return await this.evenementsService.get5ProchainsEvenements(id_utilisateur);
        } catch (error) {
            throw new NotFoundException('Erreur lors de la récupération des événements');
        }
    }
}
