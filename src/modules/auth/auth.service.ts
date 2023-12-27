import { TOKEN_TYPE } from '@/common/resources';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { toSeconds } from '@/common/utils';
import { AccessTokenPayload } from './dto/access-token-payload.dto';
import { UserRole } from '@prisma/client';
import { UNAUTHORIZED_USER } from '@/common/errors';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: NestConfigService,
    private jwtService: JwtService,
  ) {}

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
    provider: string;
    providerId?: string;
  }): Promise<TokenPayloadDto> {
    console.log('data', data);
    return new TokenPayloadDto({
      expiresIn: toSeconds(this.jwtExpiresIn),
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

  private get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
  }

  async login(userData: any) {
    const { provider, providerId, email } = userData;
    const payload = { provider, providerId, email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
