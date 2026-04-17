import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({
    example: 'Jeans',
    description: 'Subcategory name should be here',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Jeans is an most popular wearing for mens',
    description: 'Subcategory name should be here',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({
    example: 1,
    description: 'category id should be here',
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  categoryId: string;
}
