import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';

interface AuthenticatedSocketData {
  user?: JwtPayload;
}

/**
 * Guard for WebSocket event handlers. Ensures the socket has been authenticated
 * (user attached in handleConnection). Use on @SubscribeMessage() handlers.
 */
@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const data = client.data as AuthenticatedSocketData;
    const user = data.user;
    if (!user?.sub) {
      throw new WsException('Unauthorized');
    }
    return true;
  }
}
