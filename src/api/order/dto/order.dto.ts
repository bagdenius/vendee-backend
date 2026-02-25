import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class OrderDto {
  @IsEnum(OrderStatus, {
    message: `Status must be one of the values: ${Object.values(OrderStatus).join(', ')}`,
  })
  @IsOptional()
  status: OrderStatus;

  @IsArray({ message: 'Order must have at least one item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class OrderItemDto {
  @IsNumber({}, { message: 'Quantity must be a number' })
  quantity: number;

  @IsNumber({}, { message: 'Price must be a number' })
  price: number;

  @IsString({ message: 'Product ID must be a string' })
  productId: string;

  @IsString({ message: 'Store ID must be a string' })
  storeId: string;
}
