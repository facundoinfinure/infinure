import { Injectable } from '@nestjs/common';

@Injectable()
export class MLService {
  // Simula una llamada al servicio de ML
  async processQuery(query: string, context: any): Promise<{ content: string }> {
    // Por ahora devuelve eco + fecha
    return { content: `Respuesta ML para: "${query}" (${new Date().toISOString()})` };
  }
} 