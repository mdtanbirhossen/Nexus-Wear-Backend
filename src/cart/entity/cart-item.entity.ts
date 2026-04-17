import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/product/entity/product.entity';
import { Size } from 'src/size/entity/size.entity';
import { Color } from 'src/color/entity/color.entity';
import { BaseEntity } from 'src/common/entities/Base.entity';

@Entity('cart_item')
export class CartItem extends BaseEntity {
  @Column()
  cartId: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column()
  sizeId: string;

  @Column()
  colorId: string;

  @Column()
  unitPrice: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Size)
  @JoinColumn({ name: 'sizeId' })
  size: Size;

  @ManyToOne(() => Color)
  @JoinColumn({ name: 'colorId' })
  color: Color;
}
