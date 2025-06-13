import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseCustomizerService {
  customize(content: string, userRole: string): string {
    switch (userRole) {
      case 'ceo':
        return `📊 [Resumen Ejecutivo] ${content}`;
      case 'director':
        return `📈 [Vista Departamental] ${content}`;
      case 'manager':
        return `✅ [Vista Operativa] ${content}`;
      case 'analyst':
        return `🔍 [Análisis Detallado] ${content}`;
      default:
        return content;
    }
  }
} 