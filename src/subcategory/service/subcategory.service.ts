import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import { Subcategory } from '../entity/subcategory.entity';
import { Repository } from 'typeorm';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    private readonly r2UploadService: R2UploadService,
  ) {}

  async create(dto: CreateSubcategoryDto, image?: Express.Multer.File) {
    const existing = await this.subcategoryRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Subcategory already exist!');
    }
    const { image: i, ...withoutImage } = dto;

    const subcategory = this.subcategoryRepository.create(withoutImage);
    const savedSubcategory = await this.subcategoryRepository.save(subcategory);

    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        savedSubcategory.id,
        'subcategory',
      );
      if (!imageUrl) {
        throw new BadRequestException('Image upload failed!');
      }
      savedSubcategory.image = imageUrl;
      await this.subcategoryRepository.save(savedSubcategory);
    }
    return {
      data: savedSubcategory,
      message: 'Created Subcategory Successfully',
      status: 'success',
    };
  }

  async findAll({
    limit = 0,
    page = 0,
    categoryId,
  }: {
    limit: number;
    page: number;
    categoryId?: string;
  }): Promise<{
    data: Subcategory[];
    limit: number;
    page: number;
    total: number;
  }> {
    const query = this.subcategoryRepository
      .createQueryBuilder('subcategory')
      .leftJoinAndSelect('subcategory.category', 'category')
      .orderBy('subcategory.id', 'DESC');

    if (categoryId) {
      query.andWhere('subcategory.categoryId = :categoryId', { categoryId });
    }
    //pagination
    if (limit && page) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();
    return { data, limit, page, total };
  }

  async findOne(id: string): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository
      .createQueryBuilder('subcategory')
      .where('subcategory.id = :id', { id })
      .leftJoinAndSelect('subcategory.category', 'category')
      .getOne();

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${id} is not found`);
    }

    // const [data, total] = await query.getManyAndCount();
    return subcategory;
  }

  async update(
    id: string,
    updateSubcategoryDto: UpdateSubcategoryDto,
    image: Express.Multer.File,
  ) {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with id ${id} not found`);
    }

    const { image: img, ...withoutImage } = updateSubcategoryDto;

    Object.assign(subcategory, withoutImage);
    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        id,
        'subcategory',
      );
      if (!imageUrl) {
        throw new BadRequestException('Subcategory image upload failed');
      }
      subcategory.image = imageUrl;
    }
    // console.log(subcategory);
    return this.subcategoryRepository.save(subcategory);
  }

  async remove(id: string) {
    const result = await this.subcategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subcategory not found with ID:${id} `);
    }
    return { message: `Subcategory deleted with ID:${id}`, status: 'success' };
  }
}
