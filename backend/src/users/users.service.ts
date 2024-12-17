import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilisateurEntity } from '../entities/utilisateur.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly userRepository: Repository<UtilisateurEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UtilisateurEntity> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
