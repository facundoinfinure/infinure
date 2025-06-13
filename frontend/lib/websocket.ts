import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;

  connect(token: string) {
    const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
    this.socket = io(url, {
      auth: { token },
    });
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  getSocket() {
    return this.socket;
  }
}

export const wsManager = new WebSocketManager(); 