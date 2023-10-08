import { RoleType } from '../../../common/constants';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
}

@Entity('users')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ unique: true, length: 60 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ nullable: true, length: 60 })
  signupVerifyToken: string;

  @Column({ nullable: true, default: null })
  verifiedAt?: Date;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role: RoleType;

  @Column({ nullable: true })
  phone?: string;

  public toUserWithoutPassword(): UserWithoutPassword {
    const { id, name, email } = this;
    return { id, name, email };
  }
}
