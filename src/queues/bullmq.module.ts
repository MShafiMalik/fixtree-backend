import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.getOrThrow<string>('redis.host');
        const port = configService.getOrThrow<number>('redis.port');
        const password = configService.get<string>('redis.password');

        return {
          connection: {
            host,
            port,
            password: password ?? undefined,
          },
        };
      },
    }),
  ],
  exports: [BullModule],
})
export class BullMQModule {}
