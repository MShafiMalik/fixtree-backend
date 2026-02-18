import { Injectable } from '@nestjs/common';
import Bowser from 'bowser';

export interface ParsedDeviceInfo {
  deviceName?: string;
  osVersion?: string;
  userAgent?: string;
}

@Injectable()
export class DeviceParserService {
  parse(userAgent: string | undefined): ParsedDeviceInfo {
    if (!userAgent) {
      return {};
    }

    const parser = Bowser.getParser(userAgent);
    const os = parser.getOS();
    const browser = parser.getBrowser();
    const platform = parser.getPlatform();

    const deviceName = [platform.type, browser.name].filter(Boolean).join(' ');

    return {
      deviceName: deviceName || undefined,
      osVersion: os.version ?? undefined,
      userAgent,
    };
  }
}
