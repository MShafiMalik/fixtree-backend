import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { APP_CONSTANTS } from '../constants/app.constants';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class UtilService {
  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, APP_CONSTANTS.SALT_ROUNDS);
  }

  /**
   * Compare a plain text password with a hashed password
   */
  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Calculate pagination offset and limit
   */
  getPaginationParams(paginationDto: PaginationDto): {
    skip: number;
    take: number;
    page: number;
    limit: number;
  } {
    const page = paginationDto.page ?? APP_CONSTANTS.DEFAULT_PAGE;
    const limit = paginationDto.limit ?? APP_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    return {
      skip,
      take: limit,
      page,
      limit,
    };
  }

  /**
   * Generate a random string of specified length
   */
  generateRandomString(length: number): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a 6-digit OTP code
   */
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check if a date is expired
   */
  isExpired(date: Date): boolean {
    return new Date() > date;
  }

  /**
   * Add minutes to a date
   */
  addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  /**
   * Add days to a date
   */
  addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}
