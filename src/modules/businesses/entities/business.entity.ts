import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { BusinessAccess } from './business-access.entity';

@Entity('businesses')
export class Business extends BaseEntity {
  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => BusinessAccess, (businessAccess) => businessAccess.business)
  businessAccesses: BusinessAccess[];
}
