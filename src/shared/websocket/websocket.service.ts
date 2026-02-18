import { Injectable, Inject, forwardRef } from '@nestjs/common';
import type { WebSocketUserDto } from './dto/websocket-user.dto';
import { WebSocketGateway } from './websocket.gateway';

/**
 * Main WebSocket API for the app: connection state (presence) and broadcasting.
 * Other modules should inject WebSocketService for isUserOnline, broadcastToUser, etc.
 * Gateway handles Socket.IO lifecycle and room join/leave (needs Socket instance).
 */
@Injectable()
export class WebSocketService {
  /** userId -> set of socketIds (multi-device) */
  private readonly userToSockets = new Map<string, Set<string>>();
  /** socketId -> user info */
  private readonly socketToUser = new Map<string, WebSocketUserDto>();
  /** socketId -> set of room names */
  private readonly socketRooms = new Map<string, Set<string>>();

  constructor(
    @Inject(forwardRef(() => WebSocketGateway))
    private readonly gateway: WebSocketGateway,
  ) {}

  // --- Connection state (used by gateway on connect/disconnect) ---

  addConnection(userId: string, socketId: string): void {
    let set = this.userToSockets.get(userId);
    if (!set) {
      set = new Set();
      this.userToSockets.set(userId, set);
    }
    set.add(socketId);
    this.socketToUser.set(socketId, {
      userId,
      socketId,
      connectedAt: new Date(),
    });
  }

  removeConnection(socketId: string): void {
    const user = this.socketToUser.get(socketId);
    if (user) {
      const set = this.userToSockets.get(user.userId);
      if (set) {
        set.delete(socketId);
        if (set.size === 0) this.userToSockets.delete(user.userId);
      }
      this.socketToUser.delete(socketId);
    }
    this.socketRooms.delete(socketId);
  }

  joinRoom(socketId: string, roomName: string): void {
    let rooms = this.socketRooms.get(socketId);
    if (!rooms) {
      rooms = new Set();
      this.socketRooms.set(socketId, rooms);
    }
    rooms.add(roomName);
  }

  leaveRoom(socketId: string, roomName: string): void {
    const rooms = this.socketRooms.get(socketId);
    if (rooms) {
      rooms.delete(roomName);
      if (rooms.size === 0) this.socketRooms.delete(socketId);
    }
  }

  // --- Presence (for other modules) ---

  getUserSocketIds(userId: string): string[] {
    const set = this.userToSockets.get(userId);
    return set ? Array.from(set) : [];
  }

  getFirstUserSocketId(userId: string): string | null {
    const set = this.userToSockets.get(userId);
    if (!set || set.size === 0) return null;
    const ids = Array.from(set);
    return ids[0] ?? null;
  }

  isUserOnline(userId: string): boolean {
    return (this.userToSockets.get(userId)?.size ?? 0) > 0;
  }

  getOnlineUserIds(): string[] {
    return Array.from(this.userToSockets.keys());
  }

  getConnectionUser(socketId: string): WebSocketUserDto | null {
    return this.socketToUser.get(socketId) ?? null;
  }

  // --- Broadcasting (for other modules) ---

  broadcastToRoom(roomName: string, event: string, data: unknown): void {
    this.gateway.getServer().to(roomName).emit(event, data);
  }

  broadcastToUser(userId: string, event: string, data: unknown): void {
    const socketIds = this.getUserSocketIds(userId);
    const server = this.gateway.getServer();
    socketIds.forEach((id) => server.to(id).emit(event, data));
  }
}
