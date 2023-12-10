import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logRequest(context, now);
      }),
      catchError((error) => {
        this.logRequest(context, now, error);
        throw error;
      }),
    );
  }

  private logRequest(
    context: ExecutionContext,
    startTime: number,
    error?: any,
  ) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const res = httpContext.getResponse();

    const { method, originalUrl, ip, headers: reqHeaders, body: reqBody } = req;
    const statusCode = error?.status || res.statusCode;
    const contentLength = res.get('content-length') || 0;
    const userAgent = req.get('user-agent') || '';

    const duration = Date.now() - startTime;
    const logJson = {
      method,
      originalUrl,
      statusCode,
      contentLength,
      duration,
      userAgent,
      ip,
    };

    if (error) {
      this.logger.log(JSON.stringify({ ...logJson, error: error.message }));
    } else {
      this.logger.log(JSON.stringify(logJson));
    }

    // 추가적으로 reqHeaders, reqBody를 로깅하고 싶다면 아래 주석을 해제하세요.
    // this.logger.log(
    //   JSON.stringify({
    //     Headers: reqHeaders,
    //     Body: reqBody,
    //   }),
    // );
  }
}
