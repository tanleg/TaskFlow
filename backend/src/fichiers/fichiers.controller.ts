import { Controller, Get, Param } from '@nestjs/common';
import { FichiersService } from './fichiers.service';
import { FichierEntity } from 'src/entities/fichier.entity';

@Controller('fichiers')
export class FichiersController {

    constructor(private readonly fichierService: FichiersService) {}
    // Endpoint pour récupérer les fichiers par ID de projet
    @Get('projet/:id')
    async getFilesByProjectId(@Param('id') idProjet: number): Promise<FichierEntity[]> {
        return this.fichierService.getFilesByProjectId(idProjet);
  }

  

}
