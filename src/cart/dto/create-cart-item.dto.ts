import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'Product ID linked to this cart item',
    example: 'uuid-prod-101',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'Quantity of the selected product',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Size ID of the selected product',
    example: 'uuid-size-3',
  })
  @IsString()
  sizeId: string;

  @ApiProperty({
    description: 'Color ID of the selected product',
    example: 'uuid-color-5',
  })
  @IsString()
  colorId: string;

  @ApiProperty({
    description: 'Unit price of the product at the time of adding to cart',
    example: 499.99,
  })
  @IsNumber()
  @Min(0)
  unitPrice: number;
}
