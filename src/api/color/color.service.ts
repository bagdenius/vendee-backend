import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma';
import { ColorDto } from './dto';

@Injectable()
export class ColorService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const color = await this.prisma.color.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Color not found');
    return color;
  }

  async getByStoreId(storeId: string) {
    return await this.prisma.color.findMany({ where: { storeId } });
  }

  async create(storeId: string, dto: ColorDto) {
    const { name, value } = dto;
    return await this.prisma.color.create({ data: { name, value, storeId } });
  }

  async update(id: string, dto: ColorDto) {
    await this.getById(id);
    const { name, value } = dto;
    return await this.prisma.color.update({
      where: { id },
      data: { name, value },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return await this.prisma.color.delete({ where: { id } });
  }
}
