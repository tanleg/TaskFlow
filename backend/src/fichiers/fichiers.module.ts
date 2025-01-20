import { Module } from '@nestjs/common';
import { FichiersController } from './fichiers.controller';
import { FichiersService } from './fichiers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichierEntity } from 'src/entities/fichier.entity';

@Module({
  controllers: [FichiersController],
  providers: [FichiersService],
  imports: [TypeOrmModule.forFeature([FichierEntity])],  // Déclarez FichierEntity ici
})
export class FichiersModule {}
