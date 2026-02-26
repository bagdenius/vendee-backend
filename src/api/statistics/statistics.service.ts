import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from '../../infra/prisma';

dayjs.locale('us');

const monthNames = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  private async calculateTotalRevenue(storeId: string) {
    const orders = await this.prisma.order.findMany({
      where: { items: { some: { storeId } } },
      include: { items: { where: { storeId } } },
    });
    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.items.reduce(
        (itemAcc, item) => item.price * item.quantity,
        0,
      );
      return acc + total;
    }, 0);
    return totalRevenue;
  }

  private async countProducts(storeId: string) {
    return this.prisma.product.findMany({ where: { storeId } });
  }

  private async countCategories(storeId: string) {
    return this.prisma.category.findMany({ where: { storeId } });
  }

  private async calculateAverageRating(storeId: string) {
    return (
      await this.prisma.review.aggregate({
        where: { storeId },
        _avg: { rating: true },
      })
    )._avg.rating;
  }

  private async calculateMonthlySales(storeId) {
    const formatDate = (date: Date): string =>
      `${monthNames.at(date.getMonth())} ${date.getDate()}`;

    const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
    const endDate = dayjs().endOf('day').toDate();
    const salesRaw = await this.prisma.order.findMany({
      where: {
        items: { some: { storeId } },
        createdAt: { gte: startDate, lte: endDate },
      },
      include: { items: true },
    });
    const salesByDate = new Map<string, number>();
    salesRaw.forEach((order) => {
      const formattedDate = formatDate(order.createdAt);
      const total = order.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      if (salesByDate.has(formattedDate))
        salesByDate.set(formattedDate, salesByDate.get(formattedDate)! + total);
      else salesByDate.set(formattedDate, total);
    });
    return Array.from(salesByDate, ([date, value]) => ({ date, value }));
  }

  private async getLastUsers(storeId: string) {
    const lastUsers = await this.prisma.user.findMany({
      where: { orders: { some: { items: { some: { storeId } } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        orders: {
          where: { items: { some: { storeId } } },
          include: {
            items: {
              where: { storeId },
              select: { price: true, quantity: true },
            },
          },
        },
      },
    });
    return lastUsers.map((user) => {
      const lastOrder = user.orders.at(-1);
      const total = lastOrder?.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      const { id, name, email, avatar } = user;
      return { id, name, email, avatar, total };
    });
  }

  async getMainStatistics(storeId: string) {
    const totalRevenue = await this.calculateTotalRevenue(storeId);
    const productCount = await this.countProducts(storeId);
    const categoriesCount = await this.countCategories(storeId);
    const averageRating = await this.calculateAverageRating(storeId);
    return [
      { id: 1, name: 'Revenue', value: totalRevenue },
      { id: 2, name: 'Products', value: productCount },
      { id: 3, name: 'Categories', value: categoriesCount },
      { id: 4, name: 'Average Rating', value: averageRating || 0 },
    ];
  }

  async getSecondaryStatistics(storeId: string) {
    const monthlySales = await this.calculateMonthlySales(storeId);
    const lastUsers = await this.getLastUsers(storeId);
    return { monthlySales, lastUsers };
  }
}
