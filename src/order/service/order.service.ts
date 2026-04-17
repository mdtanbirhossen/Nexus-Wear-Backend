import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Create a new order
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    if (!createOrderDto.products || createOrderDto.products.length === 0) {
      throw new BadRequestException('Order must contain at least one product');
    }

    // Create new order entity
    const order = this.orderRepository.create(createOrderDto);

    const savedOrder = await this.orderRepository.save(order);

    return savedOrder;
  }

  //  Get all orders
async getAllOrders({
  limit = 0,
  page = 0,
  customerId,
}: {
  limit: number;
  page: number;
  customerId?: string;
}): Promise<{
  data: Order[];
  limit: number;
  page: number;
  total: number;
}> {
  const query = this.orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.customer', 'customer')
    .orderBy('order.createdAt', 'DESC');

  // Optional filter by customer ID
  if (customerId) {
    query.andWhere('order.customerId = :customerId', { customerId });
  }

  // Pagination logic
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


  // Get single order by ID
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

    return order;
  }

  // Update order (status, payment, etc.)
  async updateOrder(id: string, updateData: Partial<Order>): Promise<Order> {
    const order = await this.getOrderById(id);

    Object.assign(order, updateData);

    return await this.orderRepository.save(order);
  }

  // Delete order
  async deleteOrder(id: string): Promise<{ message: string }> {
    const result = await this.orderRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return { message: `Order with ID ${id} deleted successfully` };
  }
}
