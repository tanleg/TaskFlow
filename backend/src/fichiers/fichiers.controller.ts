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

  @Post('/:id_projet/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, callback) => {

          const { id_projet } = req.params;
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
    @UploadedFile() file: Express.Multer.File,
    @Body() createFichierDto: CreateFichierDto,
  ) {
   
    const { nom, id_projet, upload_par } = createFichierDto;
    console.log(createFichierDto)
    if (!nom || !id_projet || !upload_par) {
      throw new Error('Nom fichier, id_projet ou nom utilisateur manquant dans la requête.');
    }

    // Récupérer la version suivante du fichier
    const nextVersion = await this.fichierService.getNextVersion(nom, Number(id_projet));
    const fileNameWithoutExt = nom.slice(0, nom.lastIndexOf(".")) || nom;
    
    const newFileName = `${fileNameWithoutExt}_v${nextVersion}${extname(file.originalname)}`;
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
  
  @Get('/download/:id_projet/:filename')
  async downloadFile(@Param('id_projet') id_projet: number, @Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(process.cwd(), 'src', 'fichiers', 'fichiers_storage', String(id_projet), filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Fichier non trouvé');
    }

    // Définir le type MIME et le forcer au téléchargement
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Lire et envoyer le fichier
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Delete('/delete/:id_projet/:filename/:version')
  async supprimerFichier(@Param('id_projet') id_projet: number, @Param('filename') filename: string, @Param('version') version: number) {
    return await this.fichierService.supprFichier(id_projet, filename, version);
  }

  @Get('/:id_projet')
  async getOtherUsers(@Param('id_projet') id_projet: number): Promise<FichierEntity[]> {
    return this.fichierService.getFilesByProjectId(id_projet);
  }
}