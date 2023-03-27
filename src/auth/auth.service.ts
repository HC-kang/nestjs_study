import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  login(user: User): string {
    const payload = { ...user };
    console.log(payload, 'payload');

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'https://example.com',
      issuer: 'https://example.com',
    });
  }
}
