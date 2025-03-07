import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { ChatService } from './chat.service'; // Import du service
  import { Injectable } from '@nestjs/common';
  import { MessageDto } from './dto/message.dto';
  
  @WebSocketGateway(3001, { cors: { origin: '*' } })
  @Injectable()
  export class ChatGateway {
    constructor(private readonly chatService: ChatService) {} // Injection du service
  
    @SubscribeMessage('joinProject')
    handleJoinProject(
      @MessageBody() projectId: string,
      @ConnectedSocket() client: Socket,
    ) {
      client.join(projectId);
      console.log(`L'utilisateur ${client.id} a rejoint le projet ${projectId}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(
      @MessageBody()
      data: {
        projectId: string;
        message: string;
        senderName: string;
        senderId: number;
      },
      @ConnectedSocket() client: Socket,
    ) {
      console.log('📩 Message reçu dans le serveur :', data); // Vérification
  
      const { projectId, message, senderName, senderId } = data;
      if (!projectId || !message.trim() || !senderName || !senderId) {
        console.log('❌ Message invalide, non traité !');
        return;
      }
      const timestamp = new Date().toISOString();
      console.log(
        `💾 Sauvegarde en BD : ${message} - ${senderName} (${senderId}) pour le projet ${projectId}`,
      );
  
      try {
        await this.chatService.saveMessage({
          texte: message,
          utilisateur: { id: senderId }, // UtilisateurEntity
          projet: { id: parseInt(projectId) },
        });
        console.log('✅ Message enregistré avec succès !');
      } catch (error) {
        console.error('🚨 Erreur lors de la sauvegarde :', error);
      }
  
      console.log('📤 Message diffusé aux autres utilisateurs.');
      client
        .to(projectId)
        .emit('receiveMessage', { text: message, senderName, timestamp });
    }
  
    @SubscribeMessage('getMessages')
    async handleGetMessages(
      @MessageBody() projectId: string,
      @ConnectedSocket() client: Socket,
    ) {
      const messages = await this.chatService.getMessagesByProject(projectId);
      client.emit('receiveMessages', messages);
    }
  }