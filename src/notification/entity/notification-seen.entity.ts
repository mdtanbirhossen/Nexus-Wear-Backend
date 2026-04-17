import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('notification_seen')
export class NotificationSeen {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  notificationId: string;

  @Column()
  customerId: string;

  @Column({ type: 'boolean', default: true })
  isSeen: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
