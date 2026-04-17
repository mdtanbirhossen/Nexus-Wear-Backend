// src/dto/create-notification.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, IsNumber } from 'class-validator';
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
    example: 1,
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Order ID associated with this notification',
    example: 1001,
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'Payment ID associated with this notification',
    example: 5005,
  })
  @IsOptional()
  @IsNumber()
  paymentId?: number;

  @ApiPropertyOptional({
    description: 'Is this notification related to an offer',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  offer?: boolean;
}
