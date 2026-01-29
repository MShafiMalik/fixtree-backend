import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { Role } from '../enums/role.enum';
import { JwtPayload } from '../types/jwt-payload.type';

interface RequestWithUser extends Request {
  user?: JwtPayload;
  requestId?: string;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AUDIT');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // Only log admin actions
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN)) {
      return next.handle();
    }

    const { method, originalUrl } = request;
    const body = request.body as Record<string, unknown> | undefined;
    const requestId = request.requestId ?? 'unknown';

    // Sanitize sensitive data from body
    const sanitizedBody = this.sanitizeBody(body);

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            JSON.stringify({
              requestId,
              action: `${method} ${originalUrl}`,
              userId: user.sub,
              role: user.role,
              body: sanitizedBody,
              timestamp: new Date().toISOString(),
            }),
          );
        },
      }),
    );
  }

  private sanitizeBody(
    body: Record<string, unknown> | undefined,
  ): Record<string, unknown> {
    if (!body || typeof body !== 'object') {
      return {};
    }

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
    const sanitized: Record<string, unknown> = { ...body };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
