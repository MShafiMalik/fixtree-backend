import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UtilModule } from './common/util/util.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';

@Module({
  imports: [AppConfigModule, DatabaseModule, UtilModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
