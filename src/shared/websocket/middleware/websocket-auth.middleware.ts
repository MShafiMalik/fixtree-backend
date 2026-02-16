import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import type { Socket } from 'socket.io';
import { JwtPayload } from '../../../common/types/jwt-payload.type';

/**
 * Extracts and verifies JWT from WebSocket handshake.
 * Token can be in: handshake.auth.token, handshake.query.token, or Authorization header.
 */
@Injectable()
export class WebSocketAuthMiddleware {
  private readonly logger = new Logger(WebSocketAuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  async verifyHandshake(handshake: Socket['handshake']): Promise<JwtPayload> {
    const token = this.extractToken(handshake);
    if (!token) {
      throw new Error('Missing token');
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch {
      this.logger.warn('WebSocket auth failed: invalid or expired token');
      throw new Error('Invalid or expired token');
    }
  }

  private extractToken(handshake: Socket['handshake']): string | null {
    const auth = handshake.auth as { token?: string; authorization?: string };
    const query = handshake.query as { token?: string | string[] };
    const headers = handshake.headers as { authorization?: string };

    // 1. auth object (e.g. client auth: { token: '...' })
    const authToken = auth.token ?? auth.authorization;
    if (authToken) {
      return authToken.startsWith('Bearer ') ? authToken.slice(7) : authToken;
    }
    // 2. query (e.g. ?token=...)
    const queryToken =
      typeof query.token === 'string'
        ? query.token
        : Array.isArray(query.token)
          ? query.token[0]
          : null;
    if (queryToken) return queryToken;
    // 3. Authorization header
    const authHeader = headers.authorization;
    if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
    return null;
  }
}
