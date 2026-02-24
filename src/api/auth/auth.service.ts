import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import type { Request, Response } from 'express';
import ms, { type StringValue } from 'ms';
import type { JwtPayload } from '../../common/interfaces';
import { isDev } from '../../common/utils';
import { PrismaService } from '../../infra/prisma';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
  private readonly JWT_REFRESH_TOKEN_TTL: StringValue;
  private readonly SERVER_DOMAIN: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.SERVER_DOMAIN = configService.getOrThrow<string>('SERVER_DOMAIN');
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });
    return { accessToken, refreshToken };
  }

  async refresh(request: Request, response: Response) {
    const refreshToken = request.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) throw new UnauthorizedException('Invalid refresh token');
    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);
    if (payload) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });
      if (!user) throw new NotFoundException('User not found');
      return this.auth(response, user.id);
    }
  }

  private auth(response: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);
    this.setCookie(
      response,
      refreshToken,
      new Date(Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL)),
    );
    return { accessToken };
  }

  private setCookie(response: Response, value: string, expires: Date) {
    response.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.SERVER_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: 'lax',
    });
  }

  async signup(response: Response, dto: SignupDto) {
    const { name, email, password } = dto;
    const existUser = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });
    if (existUser)
      throw new ConflictException(
        'User with provided email already registered',
      );
    const user = await this.prisma.user.create({
      data: { name, email, password: await hash(password) },
    });
    return this.auth(response, user.id);
  }

  async login(response: Response, dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
    if (!user || !user.password || !(await verify(user.password, password)))
      throw new UnauthorizedException('Invalid email or password');
    return this.auth(response, user.id);
  }

  async loginGoogle(request: any, response: Response) {
    const { name, email, picture } = request.user;
    let user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: { name, email, avatar: picture },
      });
    }
    const { accessToken } = this.auth(response, user.id);
    console.log(response.getHeader('set-cookie'));
    return response.redirect(
      `${this.configService.getOrThrow<string>('CLIENT_URL')}/dashboard?accessToken=${accessToken}`,
    );
  }

  async logout(response: Response) {
    this.setCookie(response, '', new Date(0));
    return true;
  }
}
