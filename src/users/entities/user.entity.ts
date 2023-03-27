import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
}

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 60 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;

  public toUserWithoutPassword(): UserWithoutPassword {
    const { id, name, email } = this;
    return { id, name, email };
  }
}
