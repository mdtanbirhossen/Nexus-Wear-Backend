import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCartItemDto } from './create-cart-item.dto';

export class CreateCartDto {
  @ApiPropertyOptional({
    description: 'Customer ID for logged-in users',
    example: 'uuid-cust-12',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Session ID for non-logged-in users',
    example: 'session_abc123',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({
    description: 'List of cart items',
    type: [CreateCartItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  items: CreateCartItemDto[];
}
