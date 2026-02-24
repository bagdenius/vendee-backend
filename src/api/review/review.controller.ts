import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth, CurrentUser } from '../../common/decorators';
import { ReviewDto } from './dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('store/:storeId')
  @Auth()
  async getByStoreId(@Param('storeId') storeId: string) {
    return await this.reviewService.getByStoreId(storeId);
  }

  @Post('store/:storeId/product/:productId')
  @Auth()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  async create(
    @Param('storeId') storeId: string,
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReviewDto,
  ) {
    return await this.reviewService.create(storeId, productId, userId, dto);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(204)
  async delete(
    @Param('id') reviewId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.reviewService.delete(reviewId, userId);
  }
}
