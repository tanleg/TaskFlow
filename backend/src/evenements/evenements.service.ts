import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TacheEntity } from 'src/entities/tache.entity';
import { JalonEntity } from 'src/entities/jalon.entity';
import { LivrableEntity } from 'src/entities/livrable.entity';

@Injectable()
export class EvenementsService {
    constructor(
        @InjectRepository(TacheEntity)
        private readonly tacheRepository: Repository<TacheEntity>,

        @InjectRepository(JalonEntity)
        private readonly jalonRepository: Repository<JalonEntity>,

        @InjectRepository(LivrableEntity)
        private readonly livrableRepository: Repository<LivrableEntity>,
    ) {}

    // lister les taches d'un utilisateur
    async findTachesByUserId(userId: number): Promise<TacheEntity[]> {
        return this.tacheRepository.find({
            where: { id_utilisateur: userId }
    });
  }
  

}
