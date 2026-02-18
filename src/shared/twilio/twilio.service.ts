import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class TwilioService {
  private client: Twilio | null = null;
  private verifyServiceSid: string;
  private phoneNumber: string;
  private isConfigured: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');

    if (accountSid?.startsWith('AC') && authToken) {
      this.client = new Twilio(accountSid, authToken);
      this.isConfigured = true;
      this.logger.log('Twilio client initialized', 'TwilioService');
    } else {
      this.logger.warn(
        'Twilio credentials not configured - SMS features disabled',
        'TwilioService',
      );
    }

    this.verifyServiceSid =
      this.configService.get<string>('twilio.verifyServiceSid') ?? '';
    this.phoneNumber =
      this.configService.get<string>('twilio.phoneNumber') ?? '';
  }

  private getClient(): Twilio {
    if (!this.client || !this.isConfigured) {
      throw new BadRequestException('Twilio is not configured');
    }
    return this.client;
  }

  async sendSms(to: string, message: string): Promise<void> {
    const client = this.getClient();

    try {
      await client.messages.create({
        body: message,
        from: this.phoneNumber,
        to,
      });
      this.logger.log(`SMS sent to ${to}`, 'TwilioService');
    } catch (error) {
      this.logger.error(
        `Failed to send SMS to ${to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'TwilioService',
      );
      throw error;
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<void> {
    const client = this.getClient();

    try {
      await client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          to: phoneNumber,
          channel: 'sms',
        });
      this.logger.log(
        `Verification code sent to ${phoneNumber}`,
        'TwilioService',
      );
    } catch (error) {
      this.logger.error(
        `Failed to send verification to ${phoneNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'TwilioService',
      );
      throw error;
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const client = this.getClient();

    try {
      const verification = await client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          to: phoneNumber,
          code,
        });

      const isValid = verification.status === 'approved';
      this.logger.log(
        `Phone verification for ${phoneNumber}: ${isValid ? 'success' : 'failed'}`,
        'TwilioService',
      );
      return isValid;
    } catch (error) {
      this.logger.error(
        `Failed to verify code for ${phoneNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'TwilioService',
      );
      return false;
    }
  }
}
