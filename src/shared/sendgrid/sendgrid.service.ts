import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { LoggerService } from '../logger/logger.service';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}

@Injectable()
export class SendGridService {
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const apiKey = this.configService.get<string>('sendgrid.apiKey');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
    this.fromEmail =
      this.configService.get<string>('sendgrid.fromEmail') ??
      'noreply@fixtree.com';
    this.fromName =
      this.configService.get<string>('sendgrid.fromName') ?? 'Fixtree';
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const msg = {
        to: options.to,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: options.subject,
        text: options.text ?? '',
        html: options.html ?? '',
        ...(options.templateId && { templateId: options.templateId }),
        ...(options.dynamicTemplateData && {
          dynamicTemplateData: options.dynamicTemplateData,
        }),
      } satisfies MailDataRequired;

      await sgMail.send(msg);
      this.logger.log(`Email sent to ${options.to}`, 'SendGridService');
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'SendGridService',
      );
      throw error;
    }
  }

  async sendTemplateEmail(
    to: string,
    templateId: string,
    dynamicTemplateData: Record<string, unknown>,
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: '', // Subject is in the template
      templateId,
      dynamicTemplateData,
    });
  }
}
