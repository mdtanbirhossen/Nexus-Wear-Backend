import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from '../entity/size.entity';
import { Repository } from 'typeorm';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import { CreateSizeDto } from '../dto/create-size.dto';
import { UpdateSizeDto } from '../dto/update-size.dto';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,

    private readonly r2UploadService: R2UploadService,
  ) {}

  async create(createSizeDto: CreateSizeDto, image: Express.Multer.File) {
    const { image: img, ...withoutImage } = createSizeDto;

    const size = this.sizeRepository.create(withoutImage);
    const savedSize = await this.sizeRepository.save(size);
    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        savedSize.id,
        'size',
      );
      if (!imageUrl) {
        throw new Error('size image upload failed');
      }
      savedSize.image = imageUrl;
      await this.sizeRepository.save(savedSize);
    }
    return {
      data: savedSize,
      message: 'Created size Successfully',
      status: 'success',
    };
  }

  async findAll({
    limit = 0,
    page = 0,
  }: {
    limit?: number;
    page?: number;
  }): Promise<{ data: Size[]; page: number; limit: number; total: number }> {
    const query = this.sizeRepository
      .createQueryBuilder('size')
      .orderBy('size.id', 'DESC');

    if (limit && page) {
      console.log('hello');
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { data, page, limit, total };
  }

  async findOne(id: string) {
    const size = await this.sizeRepository
      .createQueryBuilder('size')
      .where('size.id = :id', { id })
      .getOne();

    if (!size) {
      throw new NotFoundException(`size with ID:${id} not found`);
    }
    return size;
  }

  async update(
    id: string,
    updateSizeDto: UpdateSizeDto,
    image: Express.Multer.File,
  ) {
    const size = await this.findOne(id);
    const { image: img, ...withoutImage } = updateSizeDto;

    Object.assign(size, withoutImage);
    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        id,
        'size',
      );
      if (!imageUrl) {
        throw new Error('size image upload failed');
      }
      size.image = imageUrl;
    }
    await this.sizeRepository.save(size);

    return {
      data: size,
      message: 'Updated size Successfully!',
      status: 'success',
    };
  }

  async remove(id: string) {
    const result = await this.sizeRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Size not found with ID${id}`);
    return { message: `Size deleted with ID:${id}`, status: 'success' };
  }
}
