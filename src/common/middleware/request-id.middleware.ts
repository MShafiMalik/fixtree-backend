import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { APP_CONSTANTS } from '../constants/app.constants';

// Extend Express Request type globally
declare module 'express' {
  interface Request {
    requestId?: string;
  }
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const headerValue =
      req.headers[APP_CONSTANTS.REQUEST_ID_HEADER.toLowerCase()];
    const requestId =
      typeof headerValue === 'string' ? headerValue : randomUUID();

    req.requestId = requestId;
    res.setHeader(APP_CONSTANTS.REQUEST_ID_HEADER, requestId);

    next();
  }
}
