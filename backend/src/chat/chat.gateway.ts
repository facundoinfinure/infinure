import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

interface SendMessagePayload {
  conversationId: string;
  content: string;
  userId: string;
  organizationId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway');

  constructor(private chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.conversationId);
    this.logger.log(`Cliente ${client.id} se une a sala ${data.conversationId}`);
  }

  @SubscribeMessage('leave_conversation')
  async handleLeaveConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.conversationId);
    this.logger.log(`Cliente ${client.id} sale de sala ${data.conversationId}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() payload: SendMessagePayload,
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId, content, userId, organizationId } = payload;

    if (!conversationId || !content || !userId || !organizationId) {
      throw new WsException('Datos inválidos');
    }

    // Procesar consulta y obtener respuesta del asistente
    const assistantMessage = await this.chatService.processQuery(conversationId, userId, organizationId, content);

    // Emitir mensaje a todos en la sala
    const server = client.server as Server;
    server.to(conversationId).emit('message', assistantMessage);
  }
} 