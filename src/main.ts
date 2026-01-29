import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API prefix
  app.setGlobalPrefix('api');

  // Get config service
  const configService = app.get(ConfigService);

  // Security headers
  app.use(helmet());

  // CORS configuration
  const corsOrigins = configService.get<string[]>('app.corsOrigins') ?? [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  // Get port from config
  const port = configService.get<number>('app.port') ?? 3000;

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${String(port)}`);
  console.log(
    `📝 Environment: ${configService.get<string>('app.nodeEnv') ?? 'unknown'}`,
  );
}

void bootstrap();
