import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth, CurrentUser } from '../../common/decorators';
import type { LiqPayPaymentResponse } from '../../common/interfaces';
import { OrderDto } from './dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(201)
  @Auth()
  @UsePipes(new ValidationPipe())
  async createPayment(
    @Body() dto: OrderDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('email') userEmail: string,
  ) {
    return await this.orderService.createPayment(dto, userId, userEmail);
  }

  @Post('status')
  @HttpCode(200)
  async updateStatus(@Body() dto: LiqPayPaymentResponse) {
    return await this.orderService.updateStatus(dto);
  }
}
