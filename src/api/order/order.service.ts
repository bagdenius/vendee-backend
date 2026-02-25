import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  LiqPayPaymentResponse,
  LiqPayRequestData,
  LiqPayRroInfo,
  LiqPayRroInfoItem,
} from '../../common/interfaces';
import { LiqPay } from '../../common/utils';
import { PrismaService } from '../../infra/prisma';
import { OrderDto } from './dto';

@Injectable()
export class OrderService {
  private readonly liqpay: LiqPay;
  private readonly callbackUrl: string;
  private readonly resultUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.liqpay = new LiqPay(
      configService.getOrThrow<string>('LIQPAY_PUBLIC_KEY'),
      configService.getOrThrow<string>('LIQPAY_PRIVATE_KEY'),
    );
    this.callbackUrl = configService.getOrThrow<string>('LIQPAY_CALLBACK_URL');
    this.resultUrl = configService.getOrThrow<string>('LIQPAY_RESULT_URL');
  }

  async createPayment(dto: OrderDto, userId: string, userEmail: string) {
    const { status, items } = dto;
    const orderItems = items.map((item) => {
      const { quantity, price, productId, storeId } = item;
      return {
        quantity,
        price,
        product: { connect: { id: productId } },
        store: { connect: { id: storeId } },
      };
    });
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const order = await this.prisma.order.create({
      data: {
        status,
        total,
        items: { create: orderItems },
        user: { connect: { id: userId } },
      },
    });
    const rroItems: LiqPayRroInfoItem[] = items.map((item, index) => ({
      amount: item.quantity,
      price: item.price,
      cost: item.price * item.quantity,
      id: index + 1,
    }));
    const rro_info: LiqPayRroInfo = {
      items: rroItems,
      delivery_emails: [userEmail],
    };
    const liqPayData: LiqPayRequestData = {
      version: 7,
      action: 'pay',
      amount: total / 100,
      currency: 'USD',
      description: `Payment for the order #${order.id} at vendee`,
      order_id: order.id,
      rro_info,
      result_url: this.resultUrl,
      server_url: this.callbackUrl,
    };
    return { checkoutUrl: this.liqpay.getCheckoutUrl(liqPayData) };
  }

  async updateStatus(dto: LiqPayPaymentResponse) {
    if (!this.liqpay.isValidSignature(dto))
      throw new UnauthorizedException('Invalid signature');
    const payment = this.liqpay.decodeData(dto.data);
    if (payment.status === 'success')
      return await this.prisma.order.update({
        where: { id: payment.order_id },
        data: { status: 'PAID' },
      });
  }
}
