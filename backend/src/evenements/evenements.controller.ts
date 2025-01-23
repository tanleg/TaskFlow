import { Controller, Get, Param, NotFoundException, Post, Body, Put, BadRequestException } from '@nestjs/common';
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

    // Liste les 5 premiers evenements pour un utilisateur
    @Get(':id_utilisateur')
    async getEvenements(@Param('id_utilisateur') id_utilisateur: number): Promise<any[]> {
        try {
            return await this.evenementsService.get5PremiersEvenements(id_utilisateur);
        } catch (error) {
            throw new NotFoundException('Erreur lors de la récupération des événements');
        }
    }

    @Post('jalon/create')
        async createJalon(@Body() createJalonDto: CreateJalonDto, @Body('utilisateurId') utilisateurId: number, @Body('projetId') projetId: number): Promise<JalonEntity> {
        return this.evenementsService.createJalon(createJalonDto, projetId);
    }

    @Post('livrable/create')
        async createLivrable(@Body() createLivrableDto: CreateLivrableDto, @Body('utilisateurId') utilisateurId: number, @Body('projetId') projetId: number): Promise<LivrableEntity> {
        return this.evenementsService.createLivrable(createLivrableDto, projetId);
    }
    
    @Post('tache/create')
        async createTache(@Body() createTacheDto: CreateTacheDto, @Body('utilisateurId') utilisateurId: number, @Body('projetId') projetId: number): Promise<TacheEntity> {
        return this.evenementsService.createTache(createTacheDto, utilisateurId, projetId);
    }

    // Liste les taches dans un projet
    @Get('projet/taches/:id_projet')
    async getTachesDansProjet(@Param('id_projet') id_projet: number): Promise<any[]> {
        try {
            return await this.evenementsService.getTachesDansProjet(id_projet);
        } catch (error) {
            throw new NotFoundException('Erreur lors de la récupération des taches');
        }
    }

    // Liste les evenements dans un projet
    @Get('projet/:id_projet')
    async getProchainsEvenementsDuProjet(@Param('id_projet') id_projet: number): Promise<any[]> {
        try {
            return await this.evenementsService.getProchainsEvenementsDuProjet(id_projet);
        } catch (error) {
            throw new NotFoundException('Erreur lors de la récupération des évenements');
        }
    }

    // modifier la personne assignee a une tache
    @Put('assigner')
    async updateUtilisateurAssigneAUneTache(@Body() body: { id_tache: number, id_utilisateur_assigne: number }): Promise<TacheEntity> {
        try {
            const { id_tache, id_utilisateur_assigne } = body;

            if (!id_tache || !id_utilisateur_assigne) {
                throw new BadRequestException("id_tache et id_utilisateur_assigne sont requis");
            }

            return await this.evenementsService.updateUtilisateurAssigneAUneTache(id_tache, id_utilisateur_assigne);
        } catch (error) {
            throw new NotFoundException("Erreur pour assigner quelqu'un à la tâche", error.message);
        }
    }
}
