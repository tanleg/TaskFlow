import { Module } from '@nestjs/common';
import { ProjetController } from './projet.controller';
import { ProjetService } from './projet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjetEntity } from '../entities/projet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjetEntity])], // Import de l'entité Projet dans le module
  controllers: [ProjetController], // Enregistrement du controller
  providers: [ProjetService], // Enregistrement du service
})
export class ProjetModule {}
