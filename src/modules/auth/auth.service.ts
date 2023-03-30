import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from 'src/config/auth.config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { TokenType, RoleType, Strings } from '../../common/constants';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  async createAccessToken(data: {
    role: RoleType;
    userId: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: 3600,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  verifyAccessToken(token: string): Promise<Boolean> {
    try {
      const result = this.jwtService.verify(token);
      return result;
    } catch (error) {
      throw new UnauthorizedException(Strings.UNAUTHORIZED_EXCEPTION);
    }
  }
}
