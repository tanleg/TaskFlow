import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FichiersService } from './fichiers.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FichierEntity } from 'src/entities/fichier.entity';
import { CreateFichierDto } from './dto/create-fichier.dto';
import { Express } from 'express';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

@Controller('fichiers')
export class FichiersController {
  constructor(private readonly fichierService: FichiersService) {}

  // Endpoint pour récupérer les fichiers par ID de projet
  @Get('projet/:id')
  async getFilesByProjectId(@Param('id') idProjet: number): Promise<FichierEntity[]> {
    return this.fichierService.getFilesByProjectId(idProjet);
  }

  // Endpoint pour uploader un fichier
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const storagePath = path.join(process.cwd(), 'src', 'fichiers', 'fichiers_storage');
          callback(null, storagePath); // Utilise le répertoire relatif à l'emplacement actuel
        },
        filename: function (req, file, callback) {
          const ext = extname(file.originalname); // Récupère l'extension du fichier
          const fileName = `${Date.now()}${ext}`; // Utilisation de la date/heure pour nom temporaire
          callback(null, fileName); // Nom temporaire avant le calcul de nextVersion
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFichierDto: CreateFichierDto,
  ) {
    // Vérification que l'ID du projet et l'ID de l'utilisateur sont bien fournis
    const { id_projet, id_utilisateur, nom } = createFichierDto;
    if (!id_projet || !id_utilisateur) {
      throw new Error('ID projet ou utilisateur manquant dans le corps de la requête.');
    }

    // Calculer nextVersion avant de renommer le fichier
    const nextVersion = await this.fichierService.getNextVersion(nom, id_projet);

    // Générer le nouveau nom du fichier avec la version
    const newFileName = `${nom}_v${nextVersion}${extname(file.originalname)}`;

    // Chemins absolus pour les anciens et nouveaux fichiers
    const oldPath = path.resolve(file.path);  // Chemin absolu du fichier temporaire
    const newPath = path.resolve(process.cwd(), 'src', 'fichiers', 'fichiers_storage', newFileName);

    // Vérifier si le répertoire de stockage existe, sinon le créer
    const storageDir = path.resolve(process.cwd(), 'src', 'fichiers', 'fichiers_storage', String(id_projet));
    try {
      // Vérifier si le répertoire existe, sinon créer
      await fsPromises.access(storageDir).catch(async () => {
        await fsPromises.mkdir(storageDir, { recursive: true }); // Créer le répertoire si nécessaire
        console.log('Répertoire de stockage créé');
      });
    } catch (err) {
      console.error('Erreur lors de la création du répertoire de stockage :', err);
      throw new Error('Erreur lors de la création du répertoire de stockage.');
    }

    try {
      // Renommer le fichier après l'upload
      await fsPromises.rename(oldPath, newPath);

      // Log du nom et nextVersion
      console.log(`Fichier renommé en : ${newFileName}`);

      // Appel du service pour créer et sauvegarder le fichier avec le nouveau nom
      return this.fichierService.create(createFichierDto, newPath);
    } catch (error) {
      console.error('Erreur lors du renommage du fichier :', error);
      throw new Error('Erreur lors du renommage du fichier');
    }
  }
}
