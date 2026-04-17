import { BaseEntity } from 'src/common/entities/Base.entity';
import { Product } from 'src/product/entity/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('faq')
export class FAQ extends BaseEntity {
  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.faqs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ default: true })
  isVisible: boolean;
}
