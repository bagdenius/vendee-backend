import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    return await this.prisma.product.findMany({
      where: searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, color: true, reviews: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getByStoreId(storeId: string) {
    return await this.prisma.product.findMany({
      where: { storeId },
      include: { category: true, color: true },
    });
  }

  async getByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: { category: { id: categoryId } },
      include: { category: true },
    });
    if (!products) throw new NotFoundException('Products not found');
    return products;
  }

  async getPopular() {
    const popularProducts = await this.prisma.orderItem.groupBy({
      by: 'productId',
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    const productIds = popularProducts.map((item) => item.productId);
    return await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
  }

  async getSimilar(id: string) {
    const currentProduct = await this.getById(id);
    return await this.prisma.product.findMany({
      where: {
        category: { title: currentProduct.category?.title },
        NOT: { id: currentProduct.id },
      },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async create(storeId: string, dto: ProductDto) {
    const { title, description, price, images, categoryId, colorId } = dto;
    return await this.prisma.product.create({
      data: { title, description, price, images, categoryId, colorId, storeId },
    });
  }

  async update(id: string, dto: ProductDto) {
    await this.getById(id);
    const { title, description, price, images, categoryId, colorId } = dto;
    return await this.prisma.product.update({
      where: { id },
      data: { title, description, price, images, categoryId, colorId },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return await this.prisma.product.delete({ where: { id } });
  }
}
