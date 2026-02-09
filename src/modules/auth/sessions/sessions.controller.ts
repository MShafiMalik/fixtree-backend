import { Controller, Get, Delete, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';
import { SessionResponseDto } from './dto/responses';
import { MessageResponseDto } from '../dto/responses';

@Controller('auth/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async listSessions(
    @CurrentUser() user: JwtPayload,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.getSessions(user.sub);
  }

  @Delete()
  async revokeAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeAll(user.sub);
  }

  @Delete('others')
  async revokeOthers(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeOthers(user.sub, user.sessionId);
  }

  @Delete(':id')
  async revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeSession(id, user.sub);
  }
}
