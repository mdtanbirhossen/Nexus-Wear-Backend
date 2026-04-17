import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdminStatus } from 'src/common/types/status.enum';

export class UpdateAdminDto {
  @ApiPropertyOptional({
    example: 'Mr Admin',
    description: 'Admin name should be here',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiPropertyOptional({
    example: 'admin@gmail.com',
    description: 'Admin email should be here',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '123456',
    description: 'Admin password should be here',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional({
    example: '01234567890',
    description: 'Admin number should be here',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiPropertyOptional({
    example: 'Saver, Dhaka, Bangladesh',
    description: 'Admin address line should be here',
  })
  @IsOptional()
  @IsString()
  addressLine: string;

  @ApiPropertyOptional({
    example: '3399 2884 44499',
    description: 'Admin national id number should be here',
  })
  @IsOptional()
  @IsString()
  nationalId: string;

  @ApiPropertyOptional({
    default: AdminStatus.PENDING,
    description: 'Admin national id number should be here',
  })
  @IsOptional()
  @IsEnum(AdminStatus)
  status: AdminStatus;

  @ApiPropertyOptional({
    example: 1,
    description: 'Enter here admin role id ',
  })
  @IsOptional()
  @Type(() => Number)
  @IsString()
  roleId: string;
}
