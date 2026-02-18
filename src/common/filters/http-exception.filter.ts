import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../types/api-response.type';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = request.requestId ?? 'unknown';

    let status: number;
    let message: string;
    let code: string;
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        code = HttpStatus[status] || 'UNKNOWN_ERROR';
      } else {
        const responseObj = exceptionResponse as Record<string, unknown>;

        // Handle validation errors (message is an array)
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ');
          details = responseObj.message;
        } else if (typeof responseObj.message === 'string') {
          message = responseObj.message;
        } else {
          message = exception.message;
        }

        code =
          typeof responseObj.error === 'string'
            ? responseObj.error
            : HttpStatus[status] || 'UNKNOWN_ERROR';

        // Include validation details if not already set
        if (
          !details &&
          responseObj.message &&
          Array.isArray(responseObj.message)
        ) {
          details = responseObj.message;
        } else if (!details && responseObj.details) {
          details = responseObj.details;
        }
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'INTERNAL_SERVER_ERROR';

      // Log the actual error for debugging
      this.logger.error(
        `[${requestId}] Unhandled error: ${exception.message}`,
        exception.stack,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'INTERNAL_SERVER_ERROR';
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details: details,
      },
      timestamp: new Date().toISOString(),
      requestId,
    };

    response.status(status).json(errorResponse);
  }
}
