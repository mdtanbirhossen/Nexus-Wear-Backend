import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Put,
  Delete,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entity/order.entity';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create Order
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: Order,
  })
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  // Get All Orders 
  @Get()
  @ApiOperation({
    summary: 'Get all orders (with pagination & optional customer filter)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of orders',
    type: [Order],
  })
  async getAllOrders(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('customerId') customerId?: string,
  ) {
    return this.orderService.getAllOrders({ limit, page, customerId });
  }

  // Get Single Order by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a single order by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  async getOrderById(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  // Update Order (status, payment, etc.)
  @Put(':id')
  @ApiOperation({ summary: 'Update order details' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
    type: Order,
  })
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: Partial<Order>,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, updateData);
  }

  // Delete Order
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  async deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.orderService.deleteOrder(id);
  }
}
