import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UtilisateurEntity } from '../entities/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UtilisateurEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
