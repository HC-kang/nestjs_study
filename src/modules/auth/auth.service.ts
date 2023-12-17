import { TOKEN_TYPE } from '@/common/resources';
import { required } from '@/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { toSeconds } from '@/common/utils';
import { AccessTokenPayload } from './dto/access-token-payload.dto';
import { UserRole } from '@prisma/client';
import { UNAUTHORIZED_USER } from '@/common/errors';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const ROUNDS_OF_HASHING = 12;
    return await bcrypt.hash(password, ROUNDS_OF_HASHING);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async createAccessToken(data: {
    role: UserRole;
    userId: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: toSeconds(required('JWT_EXPIRES_IN') as string),
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TOKEN_TYPE.ACCESS_TOKEN,
        role: data.role,
      } as AccessTokenPayload),
    });
  }

  async verifyAccessToken(
    token: string,
  ): Promise<AccessTokenPayload | UNAUTHORIZED_USER> {
    const result = await this.jwtService.verify(token);
    return result;
  }
}
