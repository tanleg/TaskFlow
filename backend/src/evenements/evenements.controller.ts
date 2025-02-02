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
        async createJalon(@Body() createJalonDto: CreateJalonDto): Promise<JalonEntity> {
        return this.evenementsService.createJalon(createJalonDto);
    }

    @Post('livrable/create')
        async createLivrable(@Body() createLivrableDto: CreateLivrableDto): Promise<LivrableEntity> {
        return this.evenementsService.createLivrable(createLivrableDto);
    }
    
    @Post('tache/create')
        async createTache(@Body() createTacheDto: CreateTacheDto): Promise<TacheEntity> {
        return this.evenementsService.createTache(createTacheDto);
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

    // Liste les jalons dans un projet
    @Get('projet/jalons/:id_projet')
    async getJalonsDansProjet(@Param('id_projet') id_projet: number): Promise<any[]> {
        try {
            return await this.evenementsService.getJalonsDansProjet(id_projet);
        } catch (error) {
            throw new NotFoundException('Erreur lors de la récupération des jalons');
        }
    }

    // Liste les livrables dans un projet
    @Get('projet/livrables/:id_projet')
    async getLivrablesDansProjet(@Param('id_projet') id_projet: number): Promise<any[]> {
        try {
            return await this.evenementsService.getLivrablesDansProjet(id_projet);
        } catch (error) {
            throw new NotFoundException('Erreur lors de la récupération des livrables');
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

    @Put('assigner/chef')
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

    @Put('tache/:id_tache/statut')
    async changerStatutTache(@Param("id_tache") id_tache: number) {
            return await this.evenementsService.changerStatutTache(id_tache);
    }

    @Put('livrable/:id_livrable/statut')
    async changerStatutLivrable(@Param("id_livrable") id_livrable: number) {
            return await this.evenementsService.changerStatutLivrable(id_livrable);
    }

}
