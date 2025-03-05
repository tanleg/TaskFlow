import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async saveMessage(messageDto: MessageDto) {
    console.log('💾 Tentative de sauvegarde en BD :', messageDto);

    try {
      const message = this.messageRepository.create({
        texte: messageDto.texte,
        date_envoi: new Date(),
        utilisateur: { id: messageDto.utilisateur.id }, // Utilisation de l'ID utilisateur
        projet: { id: messageDto.projet.id }, // Utilisation de l'ID projet
      });

      const savedMessage = await this.messageRepository.save(message);
      console.log('✅ Message enregistré en BD :', savedMessage);
      return savedMessage;
    } catch (error) {
      console.error("🚨 Erreur lors de l'enregistrement :", error);
      throw error;
    }
  }

  // chat.service.ts
  async getMessagesByProject(projectId: string) {
    const projectIdNumber = parseInt(projectId, 10);
    return await this.messageRepository.find({
      where: { projet: { id: projectIdNumber } },
      relations: ['utilisateur', 'projet'], // Relations à vérifier
    });
  }
}