import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { isDev } from './common/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  if (isDev(configService)) app.use(morgan('dev'));
  app.enableCors({
    origin: [configService.getOrThrow<string>('CLIENT_URL')],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });
  await app.listen(configService.getOrThrow<number>('SERVER_PORT') ?? 3000);
}
bootstrap();
