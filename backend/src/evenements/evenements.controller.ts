import { Controller, Get, Param, NotFoundException, Post, Body } from '@nestjs/common';
import { EvenementsService } from './evenements.service';

import { CreateJalonDto } from './dto/create-jalon.dto';
import { JalonEntity } from '../entities/jalon.entity';
import { CreateLivrableDto } from './dto/create-livrable.dto';
import { LivrableEntity } from 'src/entities/livrable.entity';
import { TacheEntity } from 'src/entities/tache.entity';
import { CreateTacheDto } from './dto/create-tache.dto';

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

    @Post('jalon/create')
        async createJalon(@Body() createJalonDto: CreateJalonDto, @Body('utilisateurId') utilisateurId: number, @Body('projetId') projetId: number): Promise<JalonEntity> {
        return this.evenementsService.createJalon(createJalonDto, utilisateurId, projetId);
    }

    @Post('livrable/create')
        async createLivrable(@Body() createLivrableDto: CreateLivrableDto, @Body('utilisateurId') utilisateurId: number, @Body('projetId') projetId: number): Promise<LivrableEntity> {
        return this.evenementsService.createLivrable(createLivrableDto, utilisateurId, projetId);
    }
    
    @Post('tache/create')
        async createTache(@Body() createTacheDto: CreateTacheDto, @Body('utilisateurId') utilisateurId: number, @Body('projetId') projetId: number): Promise<TacheEntity> {
        return this.evenementsService.createTache(createTacheDto, utilisateurId, projetId);
    }
}
