import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { BannerService } from '../service/banner.service';
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.bannerService.create(createBannerDto, image);
  }

  @Get()
  @ApiOperation({ summary: 'Get all banner' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.bannerService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'find banner by id' })
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(id);
  }
}
