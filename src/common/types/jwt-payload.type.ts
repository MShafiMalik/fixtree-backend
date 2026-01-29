import { Role } from '../enums/role.enum';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  sessionId: string;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload {
  sub: string; // User ID
  sessionId: string;
  iat?: number;
  exp?: number;
}
