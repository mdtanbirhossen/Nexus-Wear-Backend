import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private readonly r2UploadService: R2UploadService,
  ) {}

  async create(dto: CreateCategoryDto, image?: Express.Multer.File) {
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('Category already exist!');
    }
    const { image: i, ...withoutImage } = dto;

    const category = this.categoryRepository.create(withoutImage);
    const savedCategory = await this.categoryRepository.save(category);

    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        savedCategory.id,
        'category',
      );
      if (!imageUrl) {
        throw new BadRequestException('Image upload failed!');
      }
      savedCategory.image = imageUrl;
      await this.categoryRepository.save(savedCategory);
    }
    return {
      data: savedCategory,
      message: 'Created Category Successfully',
      status: 'success',
    };
  }

  async findAll({
    page = 0,
    limit = 0,
  }: {
    page: number;
    limit: number;
  }): Promise<{
    data: Category[];
    page: number;
    total: number;
    limit: number;
  }> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategory', 'subcategory')
      .orderBy('category.id', 'DESC');

    if (limit && page) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async findAllDefault(): Promise<{ data: Category[]; total: number }> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategory', 'subcategory')
      .orderBy('category.id', 'DESC');

    // query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  async findOne(id: string) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .leftJoinAndSelect('category.subcategory', 'subcategory')
      .getOne();

    if (!category) {
      throw new NotFoundException('Category Not Found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const category = await this.findOne(id);

    const { image: img, ...withoutImage } = updateCategoryDto;
    Object.assign(category, withoutImage);

    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        id,
        'category',
      );
      if (!imageUrl) {
        throw new BadRequestException('Category image upload failed');
      }
      category.image = imageUrl;
    }
    await this.categoryRepository.save(category);

    return {
      data: category,
      message: 'Updated Category Successfully',
      status: 'success',
    };
  }

  async remove(id: string) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No Category found with ID${id}`);
    }
    return {
      message: `Category with ID: ${id} has deleted`,
      status: 'success',
    };
  }
}
