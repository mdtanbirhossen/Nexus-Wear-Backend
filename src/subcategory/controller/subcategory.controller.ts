import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { SubcategoryService } from '../service/subcategory.service';
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreateSubcategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.subcategoryService.create(dto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subcategory' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('categoryId') categoryId,
  ) {
    return this.subcategoryService.findAll({ limit, page, categoryId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subcategory by ID' })
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() body: UpdateSubcategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.subcategoryService.update(id, body, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remove(id);
  }
}
