import { Controller, Get, Delete, UseGuards, Param } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';

@Controller('auth/sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  async listSessions(@CurrentUser() user: JwtPayload) {
    return this.sessionsService.getSessions(user.sub);
  }

  @Delete()
  async revokeAll(@CurrentUser() user: JwtPayload) {
    await this.sessionsService.revokeAll(user.sub);
    return { message: 'All sessions revoked' };
  }

  @Delete('others')
  async revokeOthers(@CurrentUser() user: JwtPayload) {
    await this.sessionsService.revokeOthers(user.sub, user.sessionId);
    return { message: 'Other sessions revoked' };
  }

  @Delete(':id')
  async revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.sessionsService.revokeSession(id, user.sub);
    return { message: 'Session revoked' };
  }
}
