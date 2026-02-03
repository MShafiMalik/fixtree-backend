import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UtilModule } from './common/util/util.module';
import { LoggerModule } from './shared/logger/logger.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { SendGridModule } from './shared/sendgrid/sendgrid.module';
import { TwilioModule } from './shared/twilio/twilio.module';
import { UploadModule } from './shared/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    UtilModule,
    LoggerModule,
    CloudinaryModule,
    SendGridModule,
    TwilioModule,
    UploadModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*path');
  }
}
