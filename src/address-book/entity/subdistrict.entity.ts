import { BaseEntity } from 'src/common/entities/Base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { District } from './district.entity';

@Entity('sub_district')
export class SubDistrict extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'district_id' })
  districtId: string;

  @ManyToOne(() => District, (district) => district.subDistrict, {
    nullable: true,
  })
  district: District;
}
