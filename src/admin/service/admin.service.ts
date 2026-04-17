import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entity/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from '../dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import { AuthService } from 'src/auth/service/auth.service';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { RoleService } from 'src/role/service/role.service';
import { AdminStatus } from 'src/common/types/status.enum';
import { UpdateAdminDto } from '../dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    private readonly authService: AuthService,
    private readonly r2UploadService: R2UploadService,
    private readonly roleService: RoleService,
  ) {}

  async create(createAdminDto: CreateAdminDto, image: Express.Multer.File) {
    const existingAdmin = await this.adminRepository.findOne({
      where: { email: createAdminDto.email },
    });
    if (existingAdmin) {
      throw new ForbiddenException('Admin with this email already exists');
    }

    const getRoleById = await this.roleService.findOne(createAdminDto.roleId);

    if (!getRoleById) {
      throw new NotFoundException(
        `Role with Id: ${createAdminDto.roleId} not found!`,
      );
    }
    const { image: img, ...adminData } = createAdminDto;

    adminData.password = await bcrypt.hash(adminData.password, 10);

    const admin = this.adminRepository.create(adminData);
    const savedAdmin = await this.adminRepository.save(admin);

    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        savedAdmin.id,
        'admin',
      );
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      savedAdmin.image = imageUrl;
      await this.adminRepository.save(savedAdmin);
    }

    const adminInfo = await this.adminRepository.findOne({
      where: { email: savedAdmin.email },
      relations: ['role'],
    });

    if (!adminInfo) {
      throw new NotFoundException('Admin not found');
    }

    const token = this.authService.generateToken({
      id: savedAdmin.id,
      email: savedAdmin.email,
      role: adminInfo.role.name,
    });

    return {
      data: adminInfo,
      accessToken: token,
      message: 'Admin Registered Successfully',
      status: 'success',
    };
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email },
      relations: ['role'],
    });

    if (!admin) {
      throw new NotFoundException('Admin with this email not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }

    const token = this.authService.generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role.name,
    });
    return {
      data: admin,
      accessToken: token,
      message: 'Admin login successful!',
      status: 'success',
    };
  }

  async findAll({
    limit = 0,
    page = 0,
    status,
    search,
  }: {
    limit: number;
    page: number;
    status?: AdminStatus;
    search?: string;
  }): Promise<{ data: Admin[]; total: number; page: number; limit: number }> {
    const query = this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .orderBy('admin.id', 'DESC');

    if (status) {
      query.andWhere('admin.status LIKE :status', {
        status,
      });
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query.where(
        '(LOWER(admin.name) LIKE :search OR LOWER(admin.email) LIKE :search)',
        { search: searchTerm },
      );
    }

    //pagination
    if (limit && page) {
      query.skip((page - 1) * limit).take(limit);
    }

    const [data, total] = await query.getManyAndCount();

    return { data, limit, total, page };
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.id =:id', { id })
      .leftJoinAndSelect('admin.role', 'role')
      .getOne();

    if (!admin) {
      throw new NotFoundException(`No admin found with ID:${id}`);
    }

    return admin;
  }

  async update(
    id: string,
    updateAdminDto: UpdateAdminDto,
    image: Express.Multer.File,
  ) {
    const { role, ...admin } = await this.findOne(id);

    const { image: img, password, ...adminData } = updateAdminDto;

    Object.assign(admin, adminData);

    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    }

    if (image) {
      const imageUrl = await this.r2UploadService.uploadImage(
        image,
        admin.id,
        'admin',
      );
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }
      admin.image = imageUrl;
    }

    await this.adminRepository.save(admin);

    const savedAdmin = await this.findOne(id);

    const token = this.authService.generateToken({
      id: admin.id,
      email: admin.email,
      role: role.name,
    });
    return {
      data: savedAdmin,
      message: 'Updated Admin Successfully',
      status: 'success',
      accessToken: token,
    };
  }

  async hardRemove(id: string) {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return { message: `Admin with ID:${id} has deleted`, status: 'success' };
  }

  async softRemove(id: string) {
    const admin = await this.findOne(id);
    admin.status = AdminStatus.DELETED;
    await this.adminRepository.save(admin);
    return { message: `Admin with ID:${id} has deleted`, status: 'success' };
  }
}
