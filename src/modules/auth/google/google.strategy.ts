import { isErrorGuard } from '@/common/errors';
import { UsersService } from '@/modules/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
    });
  }

  async validate(accessToken, refreshToken, profile, cb) {
    const {
      id: providerId,
      displayName,
      name: { _familyName, _givenName },
      emails,
      photos,
      provider,
    } = profile;

    this.logger.verbose(JSON.stringify({ ...profile }));
    const user = await this.usersService.findOneByProviderId(
      provider,
      providerId,
    );
    if (!isErrorGuard(user)) {
      return cb(null, user);
    }

    const [{ value: email, _verified }] = emails;
    const [{ value: photo }] = photos;
    const userData = {
      provider,
      providerId,
      name: displayName,
      email,
      nickname: undefined,
      profileImage: photo,
      thumbnailImage: undefined,
      accessToken,
      refreshToken,
    };
    await this.usersService.registerUserSSO(userData);
    cb(null, userData);
  }
}
