import { BaseEntity } from 'src/common/entities/Base.entity';
import { PaymentStatus, PaymentType } from 'src/common/types/status.enum';
import { Customer } from 'src/customer/entity/customer.entity';
import { Order } from 'src/order/entity/order.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('payment')
export class Payment extends BaseEntity {
  
  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  addressLine: string;

  @Column({ unique: true })
  transactionId: string;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.COD,
  })
  paymentType: PaymentType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column()
  orderId: string;

  @Column()
  customerId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Customer, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}
