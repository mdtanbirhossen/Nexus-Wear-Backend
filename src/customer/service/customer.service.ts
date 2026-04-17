import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entity/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { R2UploadService } from 'src/r2-upload/service/r2-upload.service';
import * as bcrypt from 'bcrypt';
import { LoginCustomerDto } from '../dto/login-customer.dto';
import { AuthService } from 'src/auth/service/auth.service';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly r2UploadService: R2UploadService,
    private readonly authService: AuthService,
  ) {}

  async create(
    createCustomerDto: CreateCustomerDto,
    imageFile: Express.Multer.File,
  ) {
    const { image, ...customerData } = createCustomerDto;
    const existingCustomer = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });
    // console.log(existingCustomer);

    if (existingCustomer) {
      throw new ForbiddenException('Customer with this email already exists');
    }

    // Hash the password before saving
    if (customerData.password) {
      customerData.password = await bcrypt.hash(customerData.password, 10);
    }

    const customer = this.customerRepository.create(customerData);
    const savedCustomer = await this.customerRepository.save(customer);

    if (imageFile) {
      const imageUploadResult = await this.r2UploadService.uploadImage(
        imageFile,
        savedCustomer.id,
        'customer',
      );
      if (!imageUploadResult) {
        throw new Error('Failed to upload image');
      }
      savedCustomer.image = imageUploadResult;
      await this.customerRepository.save(savedCustomer);
    }

    const token = this.authService.generateToken({
      id: savedCustomer.id,
      email: savedCustomer.email,
      role: 'customer',
    });

    return {
      data: savedCustomer,
      accessToken: token,
      message: 'Customer Registered Successfully',
      status: 'success',
    };
  }

  async login(loginDto: LoginCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!customer) {
      throw new NotFoundException('Customer with this email not found');
    }

    if (!customer.password || !loginDto.password) {
      throw new Error('Password is missing');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      customer.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid password');
    }

    const token = this.authService.generateToken({
      id: customer.id,
      email: customer.email,
      role: 'customer',
    });

    return {
      data: customer,
      accessToken: token,
      message: 'Login Successful',
      status: 'success',
    };
  }

  async findAll({
    limit = 0,
    page = 0,
    status,
  }: {
    limit: number;
    page: number;
    status?: number;
  }): Promise<{
    data: Customer[];
    limit: number;
    page: number;
    total: number;
  }> {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .orderBy('customer.id', 'DESC');

    if (status) {
      query.andWhere('customer.status  =:status', { status });
    }

    // pagination
    if (page && limit) {
      query.skip((page - 1) * limit).take(limit);
    }
    const [data, total] = await query.getManyAndCount();
    return { data, limit, page, total };
  }

  async findOne(id: string) {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.id = :id', { id })
      .getOne();

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  // ✅ Update (PATCH) Customer
  async update(
    id: string,
    updateData: Partial<CreateCustomerDto>,
    imageFile?: Express.Multer.File,
  ) {
    const customer = await this.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // If image file is uploaded, upload and update URL
    let image: string | undefined = customer.image;
    if (imageFile) {
      const imageUploadResult = await this.r2UploadService.uploadImage(
        imageFile,
        id,
        'customer',
      );
      if (imageUploadResult) {
        image = imageUploadResult;
      }
    }

    await this.customerRepository.update(id, { ...updateData, image: image });
    const updatedCustomer = await this.findOne(id);

    return {
      data: updatedCustomer,
      message: 'Customer updated successfully',
      status: 'success',
    };
  }

  // ✅ Soft Delete Customer
  async softDelete(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.softRemove(customer);

    return {
      message: 'Customer soft deleted successfully',
      status: 'success',
    };
  }

  // ✅ Hard Delete Customer
  async hardDelete(id: string) {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);

    return {
      message: 'Customer permanently deleted successfully',
      status: 'success',
    };
  }
}
