declare module '@nestjs/websockets' {
  export function WebSocketGateway(options?: any): ClassDecorator;
  export function SubscribeMessage(message: string): MethodDecorator;
  export class WsException extends Error {}
  export interface OnGatewayInit {
    afterInit(server: any): any;
  }
  export interface OnGatewayConnection {
    handleConnection(client: any, ...args: any[]): any;
  }
  export interface OnGatewayDisconnect {
    handleDisconnect(client: any): any;
  }
  export function MessageBody(): ParameterDecorator;
  export function ConnectedSocket(): ParameterDecorator;
}

declare module '@nestjs/platform-socket.io' {
  export class IoAdapter {}
}

declare module 'socket.io' {
  export interface Server {
    to(room: string): { emit(event: string, ...args: any[]): void };
  }
  export interface Socket {
    id: string;
    join(room: string | string[]): void;
    leave(room: string): void;
    server: Server;
  }
} 