import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../../guards/roles.guard';
import { Business } from './business.entity';
import { User } from '../../users/entities/user.entity';

@Entity('business_access')
export class BusinessAccess extends BaseEntity {
  @Column({ type: 'uuid', name: 'business_id' })
  businessId: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @ManyToOne(() => Business, (business) => business.businessAccesses, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => User, (user) => user.businessAccesses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
