import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from '../../infra/prisma';
import { SignupDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { stores: true, favorites: true, orders: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { stores: true, favorites: true, orders: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async toggleFavorite(userId: string, productId: string) {
    const user = await this.getById(userId);
    const isExist = user.favorites.some((product) => product.id === productId);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        favorites: { [isExist ? 'disconnect' : 'connect']: { id: productId } },
      },
    });
    return true;
  }

  async create(dto: SignupDto) {
    const { name, email, password } = dto;
    return this.prisma.user.create({
      data: { name, email, password: await hash(password) },
    });
  }
}
