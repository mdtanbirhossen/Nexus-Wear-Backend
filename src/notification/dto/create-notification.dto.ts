// src/dto/create-notification.dto.ts
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'Notification title',
    maxLength: 255,
    example: 'Order Shipped',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'Your order has been shipped and is on its way.',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Customer ID associated with this notification',
    example: 'uuid-cust-1',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Order ID associated with this notification',
    example: 'uuid-order-1',
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Payment ID associated with this notification',
    example: 'uuid-payment-1',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional({
    description: 'Is this notification related to an offer',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  offer?: boolean;
}
