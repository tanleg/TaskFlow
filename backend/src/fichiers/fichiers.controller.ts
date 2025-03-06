import { Controller, Post, Param, UploadedFile, Body, UseInterceptors, Get, Res, NotFoundException, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FichiersService } from './fichiers.service';
import { CreateFichierDto } from './dto/create-fichier.dto';
import * as path from 'path';
import { extname } from 'path';
import * as fsPromises from 'fs/promises';
import { diskStorage } from 'multer';
import { FichierEntity } from 'src/entities/fichier.entity';
import * as fs from 'fs';
import { Response } from 'express';

@Controller('fichiers')
export class FichiersController {
  constructor(private readonly fichierService: FichiersService) {}

  // Endpoint pour télécharger un fichier et le stocker
  @Post('/:id_projet/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // Définition du répertoire de stockage et gestion des erreurs
        destination: async (req, file, callback) => {
          const { id_projet } = req.params;
          if (!id_projet) {
            return callback(new Error('ID projet manquant dans la requête'), null);
          }

          // Construction du chemin de stockage
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

        // Définition du nom du fichier
        filename: (req, file, callback) => {
          const ext = extname(file.originalname); // Extension du fichier
          const fileName = `${Date.now()}${ext}`; // Nom basé sur le timestamp
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFichierDto: CreateFichierDto,
  ) {
    const { nom, id_projet, upload_par } = createFichierDto;
    console.log(createFichierDto)

    // Vérification des informations nécessaires dans la requête
    if (!nom || !id_projet || !upload_par) {
      throw new Error('Nom fichier, id_projet ou nom utilisateur manquant dans la requête.');
    }

    // Récupération de la prochaine version du fichier à partir du service
    const nextVersion = await this.fichierService.getNextVersion(nom, Number(id_projet));
    const fileNameWithoutExt = nom.slice(0, nom.lastIndexOf(".")) || nom;

    // Construction du nouveau nom de fichier avec la version
    const newFileName = `${fileNameWithoutExt}_v${nextVersion}${extname(file.originalname)}`;
    
    // Définition des anciens et nouveaux chemins du fichier
    const projectDir = path.resolve(process.cwd(), 'src', 'fichiers', 'fichiers_storage', String(id_projet));
    const oldPath = path.join(projectDir, file.filename);
    const newPath = path.join(projectDir, newFileName);
    
    try {
      // Renommage du fichier sur le système de fichiers
      await fsPromises.rename(oldPath, newPath);
      console.log(`Fichier renommé en : ${newFileName}`);
      
      // Création d'un enregistrement du fichier dans la base de données
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
  
  // Endpoint pour télécharger un fichier existant
  @Get('/download/:id_projet/:filename')
  async downloadFile(@Param('id_projet') id_projet: number, @Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'src', 'fichiers', 'fichiers_storage', String(id_projet), filename);

    // Vérification si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Fichier non trouvé');
    }

    // Envoi du fichier avec les bons en-têtes HTTP
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Lecture et envoi du fichier
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  // Endpoint pour supprimer un fichier
  @Delete('/delete/:id_projet/:filename/:version')
  async supprimerFichier(@Param('id_projet') id_projet: number, @Param('filename') filename: string, @Param('version') version: number) {
    return await this.fichierService.supprFichier(id_projet, filename, version);
  }

  // Endpoint pour récupérer les fichiers d'un projet donné
  @Get('/:id_projet')
  async getOtherUsers(@Param('id_projet') id_projet: number): Promise<FichierEntity[]> {
    return this.fichierService.getFilesByProjectId(id_projet);
  }
}
