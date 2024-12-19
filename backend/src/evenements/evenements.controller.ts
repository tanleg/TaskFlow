import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { EvenementsService } from './evenements.service';
import { TacheEntity } from 'src/entities/tache.entity';
import { JalonEntity } from 'src/entities/jalon.entity';

@Controller('evenements')
export class EvenementsController {
  constructor(private readonly evenementsService: EvenementsService) {}

  // Endpoint to get all tasks
  @Get('taches/:userId')
  async getTachesByUserId(@Param('userId') userId: number): Promise<TacheEntity[]> {
    return this.evenementsService.findTachesByUserId(userId);
  }

//   // Endpoint to create a new jalon
//   @Post('jalons')
//   async createJalon(@Body() jalonData: Partial<JalonEntity>): Promise<JalonEntity> {
//     return this.evenementsService.createJalon(jalonData);
//   }

//   // Endpoint to delete a livrable by ID
//   @Delete('livrables/:id')
//   async deleteLivrable(@Param('id') id: number): Promise<void> {
//     return this.evenementsService.deleteLivrable(id);
//   }
}
