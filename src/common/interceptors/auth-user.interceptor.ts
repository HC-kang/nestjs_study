// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { UserEntity } from 'src/users/entities/user.entity';

// @Injectable()
// export class AuthUserInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const user = <UserEntity>request.user;
//     return next.handle().pipe(
//       map((data) => {
//         return {
//           user,
//           ...data,
//         };
//       }),
//     );
//   }
// }
