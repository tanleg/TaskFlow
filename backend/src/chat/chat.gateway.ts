// // import {
// //   WebSocketGateway,
// //   SubscribeMessage,
// //   MessageBody,
// //   ConnectedSocket,
// // } from '@nestjs/websockets';
// // import { Socket } from 'socket.io';

// // @WebSocketGateway(3001, { cors: { origin: '*' } })
// // export class ChatGateway {
// //   @SubscribeMessage('joinProject')
// //   handleJoinProject(
// //     @MessageBody() projectId: string,
// //     @ConnectedSocket() client: Socket,
// //   ) {
// //     client.join(projectId); // L'utilisateur rejoint une salle correspondant au projet
// //     console.log(`L'utilisateur ${client.id} a rejoint le projet ${projectId}`);
// //   }

// //   @SubscribeMessage('sendMessage')
// //   // handleMessage(@MessageBody() data: { projectId: string; message: string }, @ConnectedSocket() client: Socket) {
// //   //   const { projectId, message } = data;
// //   //   console.log('Message reçu pour le projet', projectId, ':', message);

// //   //   // Envoie le message à tous les clients dans la salle du projet spécifique
// //   //   client.to(projectId).emit('receiveMessage', message);
// //   // }
// //   handleMessage(
// //     @MessageBody()
// //     data: { projectId: string; message: string; senderName: string },
// //     @ConnectedSocket() client: Socket,
// //   ) {
// //     const { projectId, message, senderName } = data;
// //     const timestamp = new Date().toISOString(); // Format d'heure ISO

// //     console.log(
// //       `Message reçu de ${senderName} pour le projet ${projectId} : ${message} à ${timestamp}`,
// //     );

// //     // Envoie le message avec le nom de l'expéditeur et l'heure
// //     client
// //       .to(projectId)
// //       .emit('receiveMessage', { text: message, senderName, timestamp });
// //   }
// // }

// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Socket } from 'socket.io';

// @WebSocketGateway(3001, { cors: { origin: '*' } })
// export class ChatGateway {
//   @SubscribeMessage('joinProject')
//   handleJoinProject(
//     @MessageBody() projectId: string,
//     @ConnectedSocket() client: Socket,
//   ) {
//     client.join(projectId); // L'utilisateur rejoint une salle correspondant au projet
//     console.log(`L'utilisateur ${client.id} a rejoint le projet ${projectId}`);
//   }

//   @SubscribeMessage('sendMessage')
//   handleMessage(
//     @MessageBody()
//     data: { projectId: string; message: string; senderName: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     const { projectId, message, senderName } = data;
//     const timestamp = new Date().toISOString(); // Format d'heure ISO

//     console.log(
//       `Message reçu de ${senderName} pour le projet ${projectId} : ${message} à ${timestamp}`,
//     );

//     // Envoie le message avec le nom de l'expéditeur et l'heure
//     client
//       .to(projectId)
//       .emit('receiveMessage', { text: message, senderName, timestamp });
//   }
// }

import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { Injectable } from '@nestjs/common';
  import { MessageDto } from './dto/message.dto';
import { ChatService } from './chat.service';
  
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