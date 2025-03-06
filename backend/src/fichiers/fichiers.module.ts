// fichiers.module.ts
import { Module } from '@nestjs/common';
import { FichiersService } from './fichiers.service';
import { FichiersController } from './fichiers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichierEntity } from 'src/entities/fichier.entity';
import { ProjetEntity } from 'src/entities/projet.entity';
import { UtilisateurEntity } from 'src/entities/utilisateur.entity'; // Assurez-vous d'importer l'entité utilisateur
import { ProjetModule } from 'src/projet/projet.module'; // Si nécessaire, importer ProjetsModule
import { UtilisateursModule } from 'src/utilisateurs/utilisateurs.module'; // Importez UtilisateursModule

@Module({
  imports: [
    TypeOrmModule.forFeature([FichierEntity, ProjetEntity, UtilisateurEntity]), // Assurez-vous d'ajouter UtilisateurEntity ici
    ProjetModule, // Importer ProjetsModule si nécessaire
    UtilisateursModule, // Importer UtilisateursModule pour résoudre la dépendance UtilisateurEntityRepository
  ],
  controllers: [FichiersController],
  providers: [FichiersService],
})
export class FichiersModule {}
