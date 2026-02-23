import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors({
    origin: [configService.getOrThrow<string>('CLIENT_URL')],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  await app.listen(configService.getOrThrow<number>('SERVER_PORT') ?? 3000);
}
bootstrap();
