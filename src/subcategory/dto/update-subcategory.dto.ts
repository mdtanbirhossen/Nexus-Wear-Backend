import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSubcategoryDto {
  @ApiPropertyOptional({
    example: 'shirt',
    description: 'category name should be here',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'description',
    description: 'category description should be here',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiPropertyOptional({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'category id should be here',
  })
  @IsString()
  categoryId: string;
}
