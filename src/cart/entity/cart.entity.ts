import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Customer } from 'src/customer/entity/customer.entity';
import { CartItem } from './cart-item.entity';
import { BaseEntity } from 'src/common/entities/Base.entity';

@Entity('cart')
export class Cart extends BaseEntity {
    // customer ID for logged in users
  @Column({ nullable: true })
  customerId: string;

  // Session ID for non-logged in users
  @Column({ nullable: true })
  sessionId: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @ManyToOne(() => Customer, { nullable: true })
  customer: Customer;
}
