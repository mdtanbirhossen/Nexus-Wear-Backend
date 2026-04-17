import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true, default: null })
  customerId: string;

  @Column({ nullable: true, default: null })
  orderId: string;

  @Column({ nullable: true, default: null })
  paymentId: string;

  @Column({ type: 'boolean', nullable: true, default: null })
  offer?: boolean;

  @Column({ type: 'boolean', default: false })
  isSeen?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
