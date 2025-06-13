import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../database/entities/conversation.entity';
import { Message, MessageRole } from '../database/entities/message.entity';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) 
    private conversationsRepo: Repository<Conversation>,
    @InjectRepository(Message) 
    private messagesRepo: Repository<Message>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async createConversation(userId: string, organizationId: string, title?: string): Promise<Conversation> {
    const conversation = this.conversationsRepo.create({
      userId,
      organizationId,
      title: title || 'New Conversation',
      context: {}
    });
    return await this.conversationsRepo.save(conversation);
  }

  async getConversationById(id: string, organizationId: string): Promise<Conversation> {
    const conversation = await this.conversationsRepo.findOne({
      where: { id, organizationId },
      relations: ['user', 'organization'],
    });
    
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    
    return conversation;
  }

  async getUserConversations(userId: string, organizationId: string): Promise<Conversation[]> {
    return this.conversationsRepo.find({
      where: { userId, organizationId, isArchived: false },
      order: { updatedAt: 'DESC' },
      take: 50
    });
  }

  async getMessages(conversationId: string, organizationId: string): Promise<Message[]> {
    // Verify conversation belongs to organization
    const conversation = await this.getConversationById(conversationId, organizationId);
    
    return this.messagesRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async addMessage(
    conversationId: string, 
    role: MessageRole, 
    content: string,
    metadata?: Record<string, any>
  ): Promise<Message> {
    const message = this.messagesRepo.create({
      conversationId,
      role,
      content,
      metadata: metadata || {},
      tokensUsed: 0,
      processingTimeMs: 0
    });
    
    const savedMessage = await this.messagesRepo.save(message);
    
    // Update conversation timestamp
    await this.conversationsRepo.update(conversationId, { 
      updatedAt: new Date() 
    });
    
    return savedMessage;
  }

  /**
   * Procesa la consulta del usuario - versión básica sin ML por ahora
   */
  async processQuery(
    conversationId: string, 
    userId: string,
    organizationId: string,
    query: string
  ): Promise<Message> {
    const startTime = Date.now();
    
    // Verificar que el usuario puede acceder a esta conversación
    const conversation = await this.getConversationById(conversationId, organizationId);
    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    // Obtener información del usuario para contexto
    const user = await this.usersRepo.findOne({ 
      where: { id: userId },
      relations: ['organization']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1. Guardar mensaje del usuario
    await this.addMessage(conversationId, MessageRole.USER, query);

    // 2. Generar respuesta básica (sin ML por ahora)
    const response = await this.generateBasicResponse(query, user);
    
    const processingTime = Date.now() - startTime;

    // 3. Guardar y devolver mensaje del asistente
    return await this.addMessage(
      conversationId, 
      MessageRole.ASSISTANT, 
      response.content,
      {
        processingTime,
        userRole: user.role,
        sources: response.sources || []
      }
    );
  }

  private async generateBasicResponse(query: string, user: User): Promise<{
    content: string;
    sources?: string[];
  }> {
    // Respuesta básica basada en el rol del usuario
    const roleResponses = {
      ceo: "Como CEO, te recomiendo revisar los KPIs principales de tu organización. Esta es una respuesta de prueba mientras implementamos el sistema de ML.",
      director: "Como director, aquí tienes un resumen de las métricas de tu departamento. Esta es una respuesta de prueba mientras implementamos el sistema de ML.",
      manager: "Como manager, estas son las métricas operativas de tu equipo. Esta es una respuesta de prueba mientras implementamos el sistema de ML.",
      analyst: "Como analista, aquí tienes los datos detallados que solicitaste. Esta es una respuesta de prueba mientras implementamos el sistema de ML.",
      viewer: "Aquí tienes la información disponible para tu consulta. Esta es una respuesta de prueba mientras implementamos el sistema de ML."
    };

    const baseResponse = roleResponses[user.role] || roleResponses.viewer;
    
    return {
      content: `${baseResponse}\n\nTu consulta fue: "${query}"\n\nIndustria: ${user.organization?.industryType || 'No especificada'}\nRol: ${user.role}`,
      sources: ['sistema-interno']
    };
  }

  async deleteConversation(conversationId: string, userId: string, organizationId: string): Promise<void> {
    const conversation = await this.getConversationById(conversationId, organizationId);
    
    if (conversation.userId !== userId) {
      throw new ForbiddenException('Access denied to this conversation');
    }

    await this.conversationsRepo.update(conversationId, { isArchived: true });
  }
} 