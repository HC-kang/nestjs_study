import { Controller, Get, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CallbackUserData } from './decorators/callback-user-data.decorator';
import { CallbackUserDataDto } from './dto/callback-user-data.dto';
import { KakaoAuthGuard } from './kakao/kakao-auth.guard';
import { KakaoExceptionFilter } from './kakao/kakao-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  @UseFilters(KakaoExceptionFilter)
  async kakaoCallback(
    @CallbackUserData() userData: CallbackUserDataDto,
    @Res() res: Response,
  ) {
    const { access_token } = await this.authService.login(userData);

    res.cookie('access_token', access_token, { httpOnly: false });
    res.redirect('http://localhost:3000');
  }
}
