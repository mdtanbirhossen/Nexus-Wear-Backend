import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { R2UploadService } from '../service/r2-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { UploadProductImageDto } from '../dto/upload-product-image.dto';

@Controller('r2-upload')
export class R2UploadController {
  constructor(private readonly r2UploadService: R2UploadService) {}

  @Post('product-image')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({ type: UploadProductImageDto })
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return this.r2UploadService.uploadImage(file, '0', 'products');
  }
}
