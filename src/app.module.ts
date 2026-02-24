import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api';
import { InfraModule } from './infra';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), InfraModule, ApiModule],
})
export class AppModule {}
