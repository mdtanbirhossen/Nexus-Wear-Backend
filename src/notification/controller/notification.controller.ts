import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateOrderNotificationDto } from '../dto/create-order-notification.dto';
import { NotificationService } from '../service/notification.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guard/admin.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { CreateOfferNotificationDto } from '../dto/create-offer-notification.dto';
import { Notification } from '../entity/notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('order')
  @ApiOperation({ summary: 'Create Order Notification' })
  @ApiResponse({
    status: 201,
    description: 'Order notification created successfully.',
    type: Notification,
  })
  async createOrderNotification(
    @Body() body: CreateOrderNotificationDto,
  ): Promise<Notification> {
    const { orderId, customerId, title, message } = body;
    return this.notificationService.createOrderNotification(
      orderId,
      customerId,
      title,
      message,
    );
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('offer')
  @ApiOperation({ summary: 'Create Offer Notification' })
  @ApiResponse({
    status: 201,
    description: 'Offer notification created successfully.',
    type: Notification,
  })
  async createOfferNotification(
    @Body() body: CreateOfferNotificationDto,
  ): Promise<Notification> {
    const { title, message } = body;
    return this.notificationService.createOfferNotification(title, message);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get notifications by Customer ID' })
  @ApiParam({ name: 'customerId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of notifications for customer.',
    type: [Notification],
  })
  async getByCustomer(
    @Param('customerId') customerId: string,
  ): Promise<Notification[]> {
    return this.notificationService.getNotificationsByCustomerId(customerId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of all notifications.',
    type: [Notification],
  })
  async getAll(): Promise<Notification[]> {
    return this.notificationService.getAllNotifications();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.notificationService.deleteNotification(id);
  }


  @Patch(':id/seen/:customerId')
  @ApiOperation({
    summary: 'Update isSeen status for a notification for customer',
  })
  async markAsSeen(
    @Param('id') id: string,
    @Param('customerId') customerId: string,
  ): Promise<void> {
    await this.notificationService.markAsSeen(id, customerId);
  }

  @Get('offers')
  @ApiOperation({ summary: 'Get all offer notifications' })
  @ApiResponse({
    status: 200,
    description: 'List of offer notifications.',
    type: [Notification],
  })
  async getOfferNotifications(): Promise<Notification[]> {
    return this.notificationService.getOfferNotifications();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notification details.',
    type: Notification,
  })
  async getNotificationById(@Param('id') id: string): Promise<Notification> {
    return this.notificationService.getNotificationById(id);
  }
}
