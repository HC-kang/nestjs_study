import { Controller, Get, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CallbackUserData } from './decorators/callback-user-data.decorator';
import { CallbackUserDataDto } from './dto/callback-user-data.dto';
import { KakaoAuthGuard } from './kakao/kakao-auth.guard';
import { KakaoExceptionFilter } from './kakao/kakao-exception.filter';
import { GoogleAuthGuard } from './google/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @UseFilters(KakaoExceptionFilter)
  async kakaoCallback(
    @CallbackUserData() userData: CallbackUserDataDto,
    @Res() res: Response,
  ) {
    console.log('userData', userData);
    const { accessToken } = await this.authService.createAccessToken(userData);
    // const { access_token } = await this.authService.login(userData);

    res.cookie('access_token', accessToken, { httpOnly: false });
    res.redirect(this.config.getOrThrow<string>('FRONTEND_URL'));
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @CallbackUserData() userData: CallbackUserDataDto,
    @Res() res: Response,
  ) {
    const { accessToken } = await this.authService.createAccessToken(userData);
    // const { access_token } = await this.authService.login(userData);

    res.cookie('access_token', accessToken, { httpOnly: false });
    res.redirect(this.config.getOrThrow<string>('FRONTEND_URL'));
  }
}
