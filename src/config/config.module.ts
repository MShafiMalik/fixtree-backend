import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import bullmqConfig from './bullmq.config';
import cloudinaryConfig from './cloudinary.config';
import sendgridConfig from './sendgrid.config';
import twilioConfig from './twilio.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env', // Local overrides (highest priority)
        `.env.${process.env.NODE_ENV ?? 'development'}`, // Environment-specific
      ],
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        bullmqConfig,
        cloudinaryConfig,
        sendgridConfig,
        twilioConfig,
      ],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
  ],
})
export class AppConfigModule {}
