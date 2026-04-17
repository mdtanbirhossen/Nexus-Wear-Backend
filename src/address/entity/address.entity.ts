import { BaseEntity } from 'src/common/entities/Base.entity';
import { Customer } from 'src/customer/entity/customer.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('address')
export class Address extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  addressLine: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column()
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}
