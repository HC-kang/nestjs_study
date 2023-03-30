import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
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
      })
    })
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
