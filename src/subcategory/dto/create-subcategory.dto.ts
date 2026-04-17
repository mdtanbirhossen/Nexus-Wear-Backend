import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'category id should be here',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
