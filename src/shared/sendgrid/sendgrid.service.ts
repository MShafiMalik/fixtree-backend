import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { LoggerService } from '../logger/logger.service';
import { SendEmailDto } from './dto/send-email.dto';

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

  async sendEmail(options: SendEmailDto): Promise<void> {
    try {
      const text = options.text?.trim() ?? '';
      const html = options.html?.trim() ?? '';
      if (!text && !html && !options.templateId) {
        throw new Error(
          'Email must have at least one of: text, html, or templateId',
        );
      }
      const contentPart = options.templateId
        ? { templateId: options.templateId }
        : text && html
          ? { text, html }
          : html
            ? { html }
            : { text };
      const msg = {
        to: options.to,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: options.subject,
        ...contentPart,
        ...(options.dynamicTemplateData && {
          dynamicTemplateData: options.dynamicTemplateData,
        }),
      } as MailDataRequired;

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
