import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ProjetService } from './projet.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjetEntity } from '../entities/projet.entity';

@Controller('projet')
export class ProjetController {
  constructor(private readonly projetService: ProjetService) {}

  @Post('create')
  async create(@Body() createProjectDto: CreateProjectDto): Promise<ProjetEntity> {
    return this.projetService.create(createProjectDto);
  }
  @Get('display')
  async findAll(): Promise<ProjetEntity[]> {
    return this.projetService.findAll();
  }

}
