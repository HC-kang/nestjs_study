import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import * as jwt from 'jsonwebtoken';

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

  // login(user: User) {
  //   const payload = { ...user };
  //   console.log(payload, 'payload');
  // }

  login(user: User) {
    const payload = { ...user };
    console.log(payload, 'payload');

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: '1d',
      audience: 'https://example.com',
      issuer: 'https://example.com',
    });
  }
}
