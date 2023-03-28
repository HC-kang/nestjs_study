import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { Strings } from "../constants";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    const jwtString = request.headers.authorization?.split('Bearer ')[1];
    if (!jwtString) {
      throw new UnauthorizedException(Strings.UNAUTHORIZED_EXCEPTION);
    }
    
    request.user = this.authService.verifyAccessToken(jwtString);
    return true;
  }
}