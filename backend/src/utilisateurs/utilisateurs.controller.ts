import { Body, Controller, Post } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UtilisateurEntity } from '../entities/utilisateur.entity';

@Controller('utilisateur') // Endpoint : /utilisateur
export class UtilisateursController {
  constructor(private readonly UtilisateursService: UtilisateursService) {}

  @Post()
  async create(@Body() createUtilisateursDto: CreateUtilisateurDto): Promise<UtilisateurEntity> {
    return this.UtilisateursService.create(createUtilisateursDto);
  }
}
