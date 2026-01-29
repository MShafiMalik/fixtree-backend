import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, originalUrl } = request;
    const ip = request.ip ?? 'unknown';
    const userAgent = request.get('User-Agent') ?? 'unknown';
    const requestId = request.requestId ?? 'unknown';

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          this.logger.log(
            `[${requestId}] ${method} ${originalUrl} ${String(statusCode)} - ${String(duration)}ms - ${ip} - ${userAgent}`,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;

          this.logger.error(
            `[${requestId}] ${method} ${originalUrl} - ${String(duration)}ms - ${ip} - ${userAgent} - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
