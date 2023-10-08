import { ConfigService } from '@nestjs/config';
import { required } from './helpers';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const authConfig = (config: ConfigService): JwtModuleAsyncOptions =>
  ({
    secret: required('JWT_SECRET', config),
    signOptions: {
      // algorithm: 'RS256',
      expiresIn: required('JWT_EXPIRES_IN', config),
    },
    // privateKey: 'key',
    // publicKey: 'key',
    verifyOptions: {
      // algorithms: ['RS256'],
    },
  } as JwtModuleAsyncOptions);
