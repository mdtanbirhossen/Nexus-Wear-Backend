import { Category } from 'src/category/entity/category.entity';
import { BaseEntity } from 'src/common/entities/Base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('subcategory')
export class Subcategory extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.subcategory, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
