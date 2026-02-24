import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma';
import { CreateStoreDto, UpdateStoreDto } from './dto';

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(storeId: string, userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException('Store not found');
    if (store.userId !== userId)
      throw new UnauthorizedException('You are not the store owner');
    return store;
  }

  async create(userId: string, dto: CreateStoreDto) {
    const { title } = dto;
    return this.prisma.store.create({ data: { title, userId } });
  }

  async update(storeId: string, userId: string, dto: UpdateStoreDto) {
    await this.getById(storeId, userId);
    const { title, description } = dto;
    return this.prisma.store.update({
      where: { id: storeId },
      data: { title, description, userId },
    });
  }

  async delete(storeId: string, userId: string) {
    await this.getById(storeId, userId);
    return await this.prisma.store.delete({ where: { id: storeId, userId } });
  }
}
