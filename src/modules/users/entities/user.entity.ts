import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../../guards/roles.guard';
import { generateHashedPasswordSync } from '../../../utils/password-hashing';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { BusinessAccess } from '../../businesses/entities/business-access.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'text' })
  name: string;

  @Column({ unique: true, type: 'text' })
  email: string;

  @Column({
    type: 'text',
    select: false,
    transformer: {
      from: (value: string) => value,
      to: generateHashedPasswordSync,
    },
  })
  password: string;

  @Column({ type: 'uuid', name: 'default_business_id', nullable: true })
  defaultBusinessId: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => BusinessAccess, (businessAccess) => businessAccess.user, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
  })
  businessAccesses: BusinessAccess[];
}
