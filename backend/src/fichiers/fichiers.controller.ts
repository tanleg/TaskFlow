import { Controller, Post, Param, UploadedFile, Body, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FichiersService } from './fichiers.service';
import { CreateFichierDto } from './dto/create-fichier.dto';
import * as path from 'path';
import { extname } from 'path';
import * as fsPromises from 'fs/promises';
import { diskStorage } from 'multer';

@Controller('fichiers')
export class FichiersController {
  constructor(private readonly fichierService: FichiersService) {}

  @Post('/:id_projet/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, callback) => {
          const { id_projet } = req.params;
          console.log('ID Projet:', id_projet);
          if (!id_projet) {
            return callback(new Error('ID projet manquant dans la requête'), null);
          }
          const storagePath = path.join(
            process.cwd(),
            'src',
            'fichiers',
            'fichiers_storage',
            String(id_projet),
          );
          try {
            await fsPromises.mkdir(storagePath, { recursive: true });
            console.log(`Répertoire créé : ${storagePath}`);
          } catch (err) {
            console.error('Erreur lors de la création du répertoire de stockage :', err);
            return callback(err, null);
          }
          callback(null, storagePath);
        },
        filename: (req, file, callback) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id_projet') id_projet: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createFichierDto: CreateFichierDto,
  ) {
    // Ajout de logs pour déboguer
    console.log('Type de id_projet:', typeof id_projet);
    console.log('Valeur de id_projet:', id_projet);
    console.log('Type de createFichierDto.id_projet:', typeof createFichierDto.id_projet);
    console.log('Valeur de createFichierDto.id_projet:', createFichierDto.id_projet);
   
    const { id_utilisateur, nom } = createFichierDto;
    if (!id_projet || !id_utilisateur) {
      throw new Error('ID projet ou utilisateur manquant dans la requête.');
    }

    // Ajouter l'ID du projet extrait de l'URL au DTO
    createFichierDto.id_projet = Number(id_projet);
    
    // Récupérer la version suivante du fichier
    const nextVersion = await this.fichierService.getNextVersion(nom, Number(id_projet));
    console.log('Prochaine version obtenue:', nextVersion);
    
    const newFileName = `${nom}_v${nextVersion}${extname(file.originalname)}`;
    // Déterminer les anciens et nouveaux chemins
    const projectDir = path.resolve(process.cwd(), 'src', 'fichiers', 'fichiers_storage', String(id_projet));
    const oldPath = path.join(projectDir, file.filename);
    const newPath = path.join(projectDir, newFileName);
    
    try {
      // Renommer le fichier
      await fsPromises.rename(oldPath, newPath);
      console.log(`Fichier renommé en : ${newFileName}`);
      
      // Créer un enregistrement pour le fichier dans la base de données
      await this.fichierService.create(createFichierDto, newPath);
      
      return { 
        message: 'Fichier téléchargé et renommé avec succès', 
        newFileName,
        version: nextVersion,
        projet: id_projet
      };
    } catch (error) {
      console.error('Erreur lors du renommage du fichier :', error);
      throw new Error('Erreur lors du renommage du fichier.');
    }
  }
}