import { Module } from '@nestjs/common';
import { PartenaireController } from './partenaire.controller';
import { PartenaireService } from './partenaire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartenaireEntity } from '../entities/partenaire.entity';
import { ProjetEntity } from 'src/entities/projet.entity';
import { EntrepriseEntity } from 'src/entities/entreprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PartenaireEntity, ProjetEntity, EntrepriseEntity])],
  controllers: [PartenaireController],
  providers: [PartenaireService],
})
export class PartenaireModule {}
