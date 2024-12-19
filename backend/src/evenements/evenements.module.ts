import { TypeOrmModule } from "@nestjs/typeorm";
import { JalonEntity } from "src/entities/jalon.entity";
import { LivrableEntity } from "src/entities/livrable.entity";
import { TacheEntity } from "src/entities/tache.entity";
import { Module } from '@nestjs/common';
import { EvenementsController } from "./evenements.controller";
import { EvenementsService } from "./evenements.service";

@Module({
    imports: [TypeOrmModule.forFeature([TacheEntity, JalonEntity, LivrableEntity])],
    controllers: [EvenementsController],
    providers: [EvenementsService],
})
export class EvenementsModule {}

