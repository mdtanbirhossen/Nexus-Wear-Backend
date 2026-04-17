// src/order/entity/order.entity.ts
import { OrderStatus, PaymentType } from 'src/common/types/status.enum';
import { Customer } from 'src/customer/entity/customer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

export interface OrderProduct {
  // Product info
  productId: string;
  productCode?: string;

  // Selected attributes
  sizeId: string;
  colorId: string;

  // Pricing and quantity
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  orderDate: Date;

  @Column()
  addressLine: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ default: 'unpaid' })
  payment?: 'paid' | 'unpaid';

  @Column({ nullable: true })
  insideDhaka?: boolean;

  @Column({ nullable: true })
  transactionId: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.COD,
  })
  paymentType: PaymentType;

  @Column()
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  customerId: string;

  @Column({ type: 'json' })
  products: OrderProduct[];

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}
