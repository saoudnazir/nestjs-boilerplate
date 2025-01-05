import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({
    type: 'text',
    name: 'access_token',
  })
  accessToken: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'text' })
  platform: string;

  @Column({ type: 'text' })
  ip: string;

  @Column({ type: 'text' })
  browser: string;

  @Column({ type: 'text' })
  device: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
