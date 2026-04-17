import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderProduct } from '../entity/order.entity';
import { OrderStatus, PaymentType } from 'src/common/types/status.enum';

export class OrderProductDto implements OrderProduct {
  @ApiProperty({ example: 1, description: 'Product ID' })
  @IsString()
  productId: string;

  @ApiProperty({
    example: 'PROD123',
    description: 'Product code',
    required: false,
  })
  @IsOptional()
  @IsString()
  productCode?: string;

  @ApiProperty({ example: 2, description: 'Selected size ID' })
  @IsString()
  sizeId: string;

  @ApiProperty({ example: 3, description: 'Selected color ID' })
  @IsString()
  colorId: string;

  @ApiProperty({ example: 1200, description: 'Unit price of product' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 2400,
    description: 'Total price for the item (unitPrice * quantity)',
  })
  @IsNumber()
  totalPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '123 Main Street, Dhaka',
    description: 'Shipping address line',
  })
  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @ApiProperty({
    example: 'Md Tanbir Hossen',
    description: 'Customer full name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'tanbir@example.com', description: 'Customer email' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '01700000000', description: 'Customer phone number' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'unpaid',
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
    description: 'Payment status',
  })
  @IsOptional()
  @IsString()
  payment?: 'paid' | 'unpaid';

  @ApiProperty({
    example: true,
    description: 'Whether the delivery is inside Dhaka or not',
  })
  @IsOptional()
  @IsBoolean()
  insideDhaka?: boolean;

  @ApiProperty({
    example: 'TXN12345',
    description: 'Transaction ID if applicable',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    description: 'Current status of the order',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    enum: PaymentType,
    default: PaymentType.COD,
    description: 'Payment method used',
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ example: 5000, description: 'Total amount of the order' })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: 1, description: 'Customer ID who placed the order' })
  @IsString()
  customerId: string;

  @ApiProperty({
    type: [OrderProductDto],
    description: 'List of ordered products with details',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
