import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { type Request, type Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async signup(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: SignupDto,
  ) {
    return await this.authService.signup(response, dto);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: LoginDto,
  ) {
    return await this.authService.login(response, dto);
  }

  @Get('google')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() _request: Request) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleOAuthCallback(
    @Req()
    request: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.loginGoogle(request, response);
  }

  @Post('refresh')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(request, response);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
