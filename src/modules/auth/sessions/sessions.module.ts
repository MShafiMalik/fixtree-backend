import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionsRepository } from './sessions.repository';
import { SessionsService } from './sessions.service';
import { DeviceParserService } from './device-parser.service';
import { SessionsController } from './sessions.controller';
import { RedisModule } from '../../../shared/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), RedisModule],
  providers: [SessionsRepository, SessionsService, DeviceParserService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
