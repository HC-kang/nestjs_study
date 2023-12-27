import { isErrorGuard } from '@/common/errors';
import { UsersService } from '@/modules/users/users.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as _ from 'lodash';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(KakaoStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('KAKAO_REST_API_KEY'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const { _raw, _json, ...profileRest } = profile;
    const { _connected_at, properties, kakao_account } = _json;

    const email = await (async () => {
      if (kakao_account.email) {
        return kakao_account.email;
      }

      const response = await this.httpService.axiosRef.post(
        'https://kapi.kakao.com/v2/user/me',
        'property_keys=["kakao_account.profile","kakao_account.email"]',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const {
        data: {
          kakao_account: { email },
        },
      } = response;
      return email;
    })();

    this.logger.verbose(JSON.stringify({ ...profileRest }));
    const { provider, id, username } = profileRest;
    const providerId = id.toString();
    const user = await this.usersService.findOneByProviderId(
      provider,
      providerId,
    );
    if (!isErrorGuard(user)) {
      return done(null, { userId: user.id, ...user });
    }

    const { _nickname, profileImage, thumbnailImage } = _.mapKeys(
      properties,
      (v, k) => {
        return _.camelCase(k);
      },
    );
    const userData = {
      // profile
      provider,
      providerId,
      name: username,
      email,
      // properties
      profileImage,
      thumbnailImage,
      // token
      accessToken,
      refreshToken,
    };
    const registeredUser = await this.usersService.registerUserSSO(userData);
    if (isErrorGuard(registeredUser)) {
      return done(registeredUser, null);
    }
    done(null, {
      role: registeredUser.role,
      userId: registeredUser.id,
      ...userData,
    });
  }
}
