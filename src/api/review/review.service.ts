import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../infra/prisma';
import { ReviewDto } from './dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { user: true },
    });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== userId)
      throw new UnauthorizedException('You are not the review author');
    return review;
  }

  async getByStoreId(storeId: string) {
    return await this.prisma.review.findMany({
      where: { storeId },
      include: { user: true },
    });
  }

  async create(
    storeId: string,
    productId: string,
    userId: string,
    dto: ReviewDto,
  ) {
    const { text, rating } = dto;
    return this.prisma.review.create({
      data: {
        text,
        rating,
        store: { connect: { id: storeId } },
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async delete(reviewId: string, userId: string) {
    await this.getById(reviewId, userId);
    return await this.prisma.review.delete({ where: { id: reviewId, userId } });
  }
}
