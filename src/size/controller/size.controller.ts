import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SizeService } from '../service/size.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSizeDto } from '../dto/create-size.dto';
import { UpdateSizeDto } from '../dto/update-size.dto';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}
  @Post()
  @ApiOperation({ summary: 'Create size' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createSizeDto: CreateSizeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.sizeService.create(createSizeDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.sizeService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get size by id' })
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update size' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateSizeDto: UpdateSizeDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.sizeService.update(id, updateSizeDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizeService.remove(id);
  }
}
