import { Module } from '@nestjs/common';
import { FichiersService } from './fichiers.service';
import { FichiersController } from './fichiers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichierEntity } from 'src/entities/fichier.entity';
import { ProjetEntity } from 'src/entities/projet.entity';
import { UtilisateurEntity } from 'src/entities/utilisateur.entity';
import { ProjetModule } from 'src/projet/projet.module';
import { UtilisateursModule } from 'src/utilisateurs/utilisateurs.module';

@Module({
  imports: [
    // Liens avec les entités nécessaires pour le module
    TypeOrmModule.forFeature([FichierEntity, ProjetEntity, UtilisateurEntity]),

    // Importation des modules projets et utilisateurs
    ProjetModule,
    UtilisateursModule,
  ],
  controllers: [
    // Contrôleur des fichiers
    FichiersController,
  ],
  providers: [
    // Service des fichiers
    FichiersService,
  ],
})
export class FichiersModule {}
