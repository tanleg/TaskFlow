import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity])], // Associe l'entité au module
  providers: [ChatGateway, ChatService],  // Assure-toi d'ajouter le gateway ici
})
export class ChatModule {}