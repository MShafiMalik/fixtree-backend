import { Platform } from '../../../../../common/enums/platform.enum';

export class SessionResponseDto {
  id: string;
  platform: Platform | null;
  deviceId: string | null;
  deviceName: string | null;
  appVersion: string | null;
  osVersion: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  isRevoked: boolean;
}
