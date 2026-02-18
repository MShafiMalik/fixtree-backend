import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { HealthModule } from './modules/health/health.module';
import { PlansModule } from './modules/plans/plans.module';
import { CountriesModule } from './modules/countries/countries.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CronModule } from './queues/cron/cron.module';
import { WebSocketModule } from './shared/websocket/websocket.module';

@Module({
  imports: [
    AppConfigModule,
    WebSocketModule,
    DatabaseModule,
    UtilModule,
    LoggerModule,
    CloudinaryModule,
    SendGridModule,
    TwilioModule,
    UploadModule,
    UsersModule,
    AuthModule,
    AdminModule,
    NotificationsModule,
    HealthModule,
    CountriesModule,
    PlansModule,
    CronModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*path');
  }
}
