import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth';
import { UserModule } from './api/user';
import { InfraModule } from './infra/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InfraModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
