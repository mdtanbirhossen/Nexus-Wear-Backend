import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../entity/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Category } from 'src/category/entity/category.entity';
import { Subcategory } from 'src/subcategory/entity/subcategory.entity';
import { Color } from 'src/color/entity/color.entity';
import { Size } from 'src/size/entity/size.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,

    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,

    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const {
      name,
      description,
      price,
      originalPrice,
      rating,
      productCode,
      images,
      availability,
      categoryId,
      subcategoryId,
      colorIds,
      sizeIds,
    } = createProductDto;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
    });
    if (!subcategory) throw new NotFoundException('Subcategory not found');

    let colors: Color[] = [];
    if (colorIds && colorIds.length > 0) {
      colors = await this.colorRepository.find({ where: { id: In(colorIds) } });
    }

    let sizes: Size[] = [];
    if (sizeIds && sizeIds.length > 0) {
      sizes = await this.sizeRepository.find({ where: { id: In(sizeIds) } });
    }

    const product = this.productRepository.create({
      name,
      description,
      price,
      originalPrice,
      rating,
      productCode,
      images,
      availability,
      category,
      subCategory: subcategory,
      colors,
      sizes,
    });

    return await this.productRepository.save(product);
  }

  async findAll({
    limit = 0,
    page = 0,
    status,
    categoryId,
    subcategoryId,
    colorId,
    sizeId,
    minPrice,
    maxPrice,
    search,
  }: {
    limit: number;
    page: number;
    status?: string;
    categoryId?: number;
    subcategoryId?: number;
    colorId?: number;
    sizeId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<{
    data: Product[];
    limit: number;
    page: number;
    total: number;
  }> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .leftJoinAndSelect('product.colors', 'colors')
      .leftJoinAndSelect('product.sizes', 'sizes')
      .leftJoinAndSelect('product.faqs', 'faqs')
      .orderBy('product.createdAt', 'DESC');

    // Filters
    if (status) {
      query.andWhere('product.status = :status', { status });
    }
    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }
    if (subcategoryId) {
      query.andWhere('subCategory.id = :subcategoryId', { subcategoryId });
    }
    if (colorId) {
      query.andWhere('colors.id = :colorId', { colorId });
    }
    if (sizeId) {
      query.andWhere('sizes.id = :sizeId', { sizeId });
    }
    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Pagination
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      limit,
      page,
      total,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'subCategory', 'colors', 'sizes', 'faqs'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const {
      name,
      description,
      price,
      productCode,
      images,
      availability,
      categoryId,
      subcategoryId,
      colorIds,
      sizeIds,
    } = updateProductDto;

    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    if (subcategoryId) {
      const subcategory = await this.subcategoryRepository.findOne({
        where: { id: subcategoryId },
      });
      if (!subcategory) throw new NotFoundException('Subcategory not found');
      product.subCategory = subcategory;
    }

    if (colorIds) {
      const colors = await this.colorRepository.find({
        where: { id: In(colorIds) },
      });
      product.colors = colors;
    }

    if (sizeIds) {
      const sizes = await this.sizeRepository.find({
        where: { id: In(sizeIds) },
      });
      product.sizes = sizes;
    }

    Object.assign(product, {
      name,
      description,
      price,
      productCode,
      images,
      availability,
    });

    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
