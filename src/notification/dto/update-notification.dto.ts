// src/dto/update-notification.dto.ts
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiPropertyOptional({
    description: 'Notification title',
    maxLength: 255,
    example: 'Order Updated',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Notification message content',
    example: 'Your order delivery date has been updated.',
  })
  @IsOptional()
  @IsString()
  message?: string;

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
    example: 'uuid-payment-5005',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiPropertyOptional({
    description: 'Is this notification related to an offer',
    example: false,
    default: null,
  })
  @IsOptional()
  @IsBoolean()
  offer?: boolean;
}
