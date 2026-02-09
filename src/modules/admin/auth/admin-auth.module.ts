import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { UtilModule } from '../../../common/util/util.module';
import { SessionsModule } from '../../auth/sessions/sessions.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UtilModule,
    PassportModule,
    SessionsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: (configService.get<string>('jwt.expiresIn') ??
            '15m') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
