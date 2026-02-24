import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma';
import { CategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async getByStoreId(storeId: string) {
    return await this.prisma.category.findMany({ where: { storeId } });
  }

  async create(storeId: string, dto: CategoryDto) {
    const { title, description } = dto;
    return await this.prisma.category.create({
      data: { title, description, storeId },
    });
  }

  async update(id: string, dto: CategoryDto) {
    await this.getById(id);
    const { title, description } = dto;
    return await this.prisma.category.update({
      where: { id },
      data: { title, description },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return await this.prisma.category.delete({ where: { id } });
  }
}
