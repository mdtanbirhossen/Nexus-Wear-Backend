import { Admin } from 'src/admin/entity/admin.entity';
import { BaseEntity } from 'src/common/entities/Base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('role')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Admin, (admin) => admin.role)
  admins: Admin[];
}
