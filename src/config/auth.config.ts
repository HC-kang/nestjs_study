import { JwtModuleOptions } from '@nestjs/jwt';

export default (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET,
  // privateKey: 'key',
  // publicKey: 'key',
  signOptions: {
    // algorithm: 'RS256',
    expiresIn: '1d',
  },
  verifyOptions: {
    // algorithms: ['RS256'],
  },
});
