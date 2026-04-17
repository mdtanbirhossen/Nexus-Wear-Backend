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
import { ColorService } from '../service/color.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateColorDto } from '../dto/create-color.dto';
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateColorDto } from '../dto/update-color.dto';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}
  @Post()
  @ApiOperation({ summary: 'Create color' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createColorDto: CreateColorDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.colorService.create(createColorDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all colors' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.colorService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Color by id' })
  findOne(@Param('id') id: string) {
    return this.colorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Color' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.colorService.update(id, updateColorDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorService.remove(id);
  }
}
