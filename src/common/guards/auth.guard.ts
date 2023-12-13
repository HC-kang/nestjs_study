import { AuthService } from '@/modules/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { messages } from '../resources';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request);
  }

  private async validateRequest(request: any) {
    const jwtString = request.headers.authorization?.split('Bearer ')[1];
    if (!jwtString) {
      throw new UnauthorizedException(messages.UNAUTHORIZED_EXCEPTION);
    }

    request.tokenPayload = await this.authService.verifyAccessToken(jwtString);
    return true;
  }
}
