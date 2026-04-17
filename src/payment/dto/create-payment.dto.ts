import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsPositive,
} from 'class-validator';
import { PaymentType, PaymentStatus } from 'src/common/types/status.enum';

export class CreatePaymentDto {
  @ApiProperty({
    example: 'TXN123456789',
    description: 'Unique transaction ID for the payment',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.COD,
    description: 'Type of payment',
  })
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty({ example: 5000, description: 'Payment amount' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    description: 'Current payment status',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({
    example: 1,
    description: 'ID of the related order',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the customer making the payment',
    required: false,
  })
  @IsOptional()
  @IsString()
  customerId?: string;
}
