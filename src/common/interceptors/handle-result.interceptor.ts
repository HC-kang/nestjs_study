import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Result, Ok, Err } from '@/common/types';

@Injectable()
export class ResultInterceptor<T> implements NestInterceptor<T, Result<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Result<T>> {
    return next.handle().pipe(
      map((data) => (data instanceof Ok ? data.value : data)),
      catchError((error) => {
        if (error instanceof Err) {
          throw new BadRequestException(error.error.message);
        }
        throw error;
      }),
    );
  }
}
