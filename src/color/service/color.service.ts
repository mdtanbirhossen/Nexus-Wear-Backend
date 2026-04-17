import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from '../entity/color.entity';
import { Repository } from 'typeorm';
import { CreateColorDto } from '../dto/create-color.dto';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import { UpdateColorDto } from '../dto/update-color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,

    private readonly r2UploadService: R2UploadService,
  ) {}

  async create(createColorDto: CreateColorDto, image: Express.Multer.File) {
    const { image: img, ...withoutImage } = createColorDto;

    const color = this.colorRepository.create(withoutImage);
    const savedColor = await this.colorRepository.save(color);
    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        savedColor.id,
        'color',
      );
      if (!imageUrl) {
        throw new Error('Color image upload failed');
      }
      savedColor.image = imageUrl;
      await this.colorRepository.save(savedColor);
    }
    return {
      data: savedColor,
      message: 'Created Color Successfully',
      status: 'success',
    };
  }

  async findAll({
    limit = 0,
    page = 0,
  }: {
    limit?: number;
    page?: number;
  }): Promise<{ data: Color[]; page: number; limit: number; total: number }> {
    const query = this.colorRepository
      .createQueryBuilder('color')
      .orderBy('color.id', 'DESC');

    if (limit && page) {
      console.log('hello');
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { data, page, limit, total };
  }

  async findOne(id: string) {
    const color = await this.colorRepository
      .createQueryBuilder('color')
      .where('color.id = :id', { id })
      .getOne();

    if (!color) {
      throw new NotFoundException(`Color with ID:${id} not found`);
    }
    return color;
  }

  async update(
    id: string,
    updateColorDto: UpdateColorDto,
    image: Express.Multer.File,
  ) {
    const color = await this.findOne(id);
    const { image: img, ...withoutImage } = updateColorDto;

    Object.assign(color, withoutImage);
    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        id,
        'color',
      );
      if (!imageUrl) {
        throw new Error('Color image upload failed');
      }
      color.image = imageUrl;
    }
    await this.colorRepository.save(color);

    return {
      data: color,
      message: 'Updated Color Successfully!',
      status: 'success',
    };
  }

  async remove(id: string) {
    const result = await this.colorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No color found with ID:${id}`);
    }
    return { message: `Color deleted with ID:${id}`, status: 'success' };
  }
}
