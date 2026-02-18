import { Controller, Get, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/types/jwt-payload.type';
import { SessionResponseDto } from './dto/responses';
import { MessageResponseDto } from '../dto/responses';

@ApiTags('sessions')
@ApiBearerAuth('JWT-auth')
@Controller('auth/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all user sessions' })
  @ApiResponse({
    status: 200,
    description: 'Sessions retrieved successfully',
    type: [SessionResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listSessions(
    @CurrentUser() user: JwtPayload,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.getSessions(user.sub);
  }

  @Delete()
  @ApiOperation({ summary: 'Revoke all user sessions' })
  @ApiResponse({
    status: 200,
    description: 'All sessions revoked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revokeAll(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeAll(user.sub);
  }

  @Delete('others')
  @ApiOperation({ summary: 'Revoke all other sessions (except current)' })
  @ApiResponse({
    status: 200,
    description: 'Other sessions revoked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async revokeOthers(
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeOthers(user.sub, user.sessionId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({
    status: 200,
    description: 'Session revoked successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async revokeSession(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<MessageResponseDto> {
    return this.sessionsService.revokeSession(id, user.sub);
  }
}
