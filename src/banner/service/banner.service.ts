import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from '../entity/banner.entity';
import { Repository } from 'typeorm';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import { UpdateBannerDto } from '../dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,

    private readonly r2UploadService: R2UploadService,
  ) {}

  async create(createBannerDto: CreateBannerDto, image?: Express.Multer.File) {
    const { image: img, ...withoutImage } = createBannerDto;
    const banner = this.bannerRepository.create(withoutImage);
    const savedBanner = await this.bannerRepository.save(banner);

    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        savedBanner.id,
        'banner',
      );
      if (!imageUrl) throw new BadRequestException('Image upload failed');
      savedBanner.image = imageUrl;
    }
    await this.bannerRepository.save(savedBanner);
    return {
      data: savedBanner,
      message: 'Created Banner Successfully',
      status: 'success',
    };
  }

  async findAll({
    page = 0,
    limit = 0,
  }: {
    page: number;
    limit: number;
  }): Promise<{ data: Banner[]; page: number; limit: number; total: number }> {
    const query = this.bannerRepository
      .createQueryBuilder('banner')
      .orderBy('banner.id', 'DESC');

    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }
    const [data, total] = await query.getManyAndCount();
    return { data, page, limit, total };
  }

  async findOne(id: string) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`No banner found with ID:${id}`);
    }
    return banner;
  }

  async update(
    id: string,
    updateBannerDto: UpdateBannerDto,
    image: Express.Multer.File,
  ) {
    const banner = await this.findOne(id);
  }
}
