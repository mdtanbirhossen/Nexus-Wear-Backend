import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from '../service/admin.service';
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { AdminStatus } from 'src/common/types/status.enum';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { UpdateAdminDto } from '../dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createAdminDto: CreateAdminDto,
    @UploadedFiles() files: { image: Express.Multer.File },
  ) {
    return this.adminService.create(createAdminDto, files.image?.[0]);
  }

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  login(@Body() loginDto: LoginAdminDto) {
    return this.adminService.login(loginDto);
  }

  // @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all admins' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String ,description: 'Search by name or email'})
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('status') status?: AdminStatus,
    @Query('search') search?: string,
  ) {
    return this.adminService.findAll({ page, limit, status ,search});
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get admin by id' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @UploadedFiles() files: { image: Express.Multer.File },
  ) {
    return this.adminService.update(id, updateAdminDto, files.image?.[0]);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('soft/:id')
  softRemove(@Param('id') id: string) {
    return this.adminService.softRemove(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  hardRemove(@Param('id') id: string) {
    return this.adminService.hardRemove(id);
  }
}
