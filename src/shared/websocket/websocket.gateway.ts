import {
  WebSocketGateway as WSGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import type { JwtPayload } from '../../common/types/jwt-payload.type';
import { WebSocketAuthMiddleware } from './middleware/websocket-auth.middleware';
import { WebSocketService } from './websocket.service';

interface AuthenticatedSocketData {
  user?: JwtPayload;
}

@WSGateway({
  cors: {
    origin: true, // Use same CORS as HTTP (configured in main.ts); true allows all in dev
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

  constructor(
    private readonly wsAuthMiddleware: WebSocketAuthMiddleware,
    @Inject(forwardRef(() => WebSocketService))
    private readonly wsService: WebSocketService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const payload = await this.wsAuthMiddleware.verifyHandshake(
        client.handshake,
      );
      const userId = payload.sub;
      (client.data as AuthenticatedSocketData).user = payload;
      this.wsService.addConnection(userId, client.id);
      client.emit('connected', {
        userId,
        socketId: client.id,
        message: 'Connected successfully',
      });
      this.logger.log(
        `WebSocket connected: userId=${userId}, socketId=${client.id}`,
      );
    } catch (err) {
      this.logger.warn(
        `WebSocket connection rejected: ${err instanceof Error ? err.message : 'Unknown'}`,
      );
      client.emit('error', {
        message: err instanceof Error ? err.message : 'Authentication failed',
      });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    this.wsService.removeConnection(client.id);
    const data = client.data as AuthenticatedSocketData;
    const userId = data.user?.sub;
    this.logger.log(
      `WebSocket disconnected: socketId=${client.id}${userId ? `, userId=${userId}` : ''}`,
    );
  }

  /** Exposed for WebSocketService broadcasting; other modules should use WebSocketService. */
  getServer(): Server {
    return this.server;
  }

  joinRoom(socket: Socket, roomName: string): void {
    void socket.join(roomName);
    this.wsService.joinRoom(socket.id, roomName);
  }

  leaveRoom(socket: Socket, roomName: string): void {
    void socket.leave(roomName);
    this.wsService.leaveRoom(socket.id, roomName);
  }
}
