// src/users/users.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UtilisateurEntity } from '../entities/utilisateur.entity';

@Controller('users') // Endpoint : /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UtilisateurEntity> {
    return this.usersService.create(createUserDto);
  }
}
