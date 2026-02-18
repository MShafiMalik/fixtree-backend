import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { WebSocketGateway } from './websocket.gateway';
import { WebSocketService } from './websocket.service';
import { WebSocketAuthMiddleware } from './middleware/websocket-auth.middleware';
import { WebSocketAuthGuard } from './guards/websocket-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn') ??
            '15m') as StringValue,
        },
      }),
    }),
  ],
  providers: [
    WebSocketGateway,
    WebSocketService,
    WebSocketAuthMiddleware,
    WebSocketAuthGuard,
  ],
  exports: [WebSocketGateway, WebSocketService, WebSocketAuthGuard],
})
export class WebSocketModule {}
