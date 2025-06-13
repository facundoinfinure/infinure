import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface CreateConversationDto {
  title?: string;
}

interface SendMessageDto {
  content: string;
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  async createConversation(@Body() dto: CreateConversationDto, @Req() req: any) {
    const user = req.user; // { userId, organizationId, role, email }
    return this.chatService.createConversation(user.userId, user.organizationId, dto.title);
  }

  @Get('conversations')
  async getUserConversations(@Req() req: any) {
    const user = req.user;
    return this.chatService.getUserConversations(user.userId, user.organizationId);
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.chatService.getConversationById(id, user.organizationId);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.chatService.getMessages(id, user.organizationId);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
    @Req() req: any,
  ) {
    const user = req.user;
    
    // Procesar la consulta del usuario y generar respuesta
    return this.chatService.processQuery(
      conversationId,
      user.userId,
      user.organizationId,
      dto.content
    );
  }

  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    await this.chatService.deleteConversation(id, user.userId, user.organizationId);
    return { success: true, message: 'Conversation archived successfully' };
  }
} 