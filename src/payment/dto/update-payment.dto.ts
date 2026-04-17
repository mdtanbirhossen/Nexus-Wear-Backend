import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaymentType, PaymentStatus } from 'src/common/types/status.enum';

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    example: 'TXN987654321',
    description: 'Transaction ID of the payment',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({
    enum: PaymentType,
    example: PaymentType.STRIPE,
    description: 'Type of payment',
  })
  @IsOptional()
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @ApiPropertyOptional({ example: 6000, description: 'Payment amount' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({
    enum: PaymentStatus,
    example: PaymentStatus.SUCCESS,
    description: 'Current payment status',
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ example: 1, description: 'Related order ID' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Customer ID making the payment',
  })
  @IsOptional()
  @IsString()
  customerId?: string;
}
