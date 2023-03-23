import { Exclude } from "class-transformer";
import { UserEntity } from "./entities/user.entity";

export class UserInfo {
  id: string;
  name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}