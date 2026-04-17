import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';
import { NotificationSeen } from '../entity/notification-seen.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(NotificationSeen)
    private readonly notificationSeenRepository: Repository<NotificationSeen>,
  ) { }

  //  Create Order Notification
  async createOrderNotification(
    orderId: string,
    customerId: string,
    title: string,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      title,
      message,
      orderId,
      customerId,
      offer: false,
    });
    return this.notificationRepository.save(notification);
  }

  //  Create Offer Notification
  async createOfferNotification(
    title: string,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      title,
      message,
      offer: true,
    });
    return this.notificationRepository.save(notification);
  }

  //  Get Notifications by Customer ID
  async getNotificationsByCustomerId(customerId: string): Promise<any[]> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.customerId = :customerId', { customerId })
      .orWhere('(notification.customerId IS NULL AND notification.offer = true)')
      .orderBy('notification.createdAt', 'DESC')
      .getMany();

    const seen = await this.notificationSeenRepository.find({
      where: { customerId },
    });

    const seenMap = new Map(seen.map(s => [s.notificationId, true]));

    return notifications.map(n => ({
      ...n,
      isSeen: seenMap.get(n.id) ?? false,
    }));
  }


  //  Get All Notifications
  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  //  Delete Notification
  async deleteNotification(id: string): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
  }

  //  Update isSeen by Notification ID
  async markAsSeen(notificationId: string, customerId: string): Promise<void> {
    const existing = await this.notificationSeenRepository.findOne({
      where: { notificationId, customerId },
    });

    if (!existing) {
      const seen = this.notificationSeenRepository.create({
        notificationId,
        customerId,
        isSeen: true,
      });
      await this.notificationSeenRepository.save(seen);
    }
  }


  //  Get Offer Notifications
  async getOfferNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { offer: true },
      order: { createdAt: 'DESC' },
    });
  }

  //  Get Notification by ID
  async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }
    return notification;
  }


}
