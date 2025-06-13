declare module 'socket.io-client' {
  export interface Socket {
    on(event: string, cb: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): this;
    disconnect(): void;
  }
  export function io(url: string, options?: any): Socket;
} 