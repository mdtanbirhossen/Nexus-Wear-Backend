import { Category } from 'src/category/entity/category.entity';
import { Color } from 'src/color/entity/color.entity';
import { BaseEntity } from 'src/common/entities/Base.entity';
import { ProductStatus } from 'src/common/types/status.enum';
import { FAQ } from 'src/faq/entity/faq.entity';
import { Size } from 'src/size/entity/size.entity';
import { Subcategory } from 'src/subcategory/entity/subcategory.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'json' })
  images?: string[];

  @Column()
  productCode?: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  originalPrice?: number;

  @Column()
  price: number;

  @Column({ default: ProductStatus.IN_STOCK })
  availability?: ProductStatus;

  // @Column()
  // categoryId: string;



  // FAQ relationship
  @OneToMany(() => FAQ, (faq) => faq.product, { cascade: true })
  faqs: FAQ[];

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Subcategory, { nullable: false })
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: Subcategory;

  @ManyToMany(() => Color)
  @JoinTable({
    name: 'product_colors',
    joinColumn: { name: 'productId' },
    inverseJoinColumn: { name: 'colorId' },
  })
  colors: Color[];

  @ManyToMany(() => Size)
  @JoinTable({
    name: 'product_sizes',
    joinColumn: { name: 'productId' },
    inverseJoinColumn: { name: 'sizeId' },
  })
  sizes: Size[];

  // Analytics
  @Column({ type: 'bigint', default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  rating?: number;

  @Column({ nullable: true })
  lastViewedAt: string;

  @Column({ type: 'bigint', default: 0 })
  orderCount: number;

  @Column({ nullable: true })
  lastOrderedAt: string;
}
