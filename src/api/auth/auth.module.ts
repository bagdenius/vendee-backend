import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy, JwtStrategy } from '../../common/strategies';
import { getJwtConfig } from '../../config';
import { UserModule, UserService } from '../user';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
