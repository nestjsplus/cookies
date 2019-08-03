import 'reflect-metadata';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const handler = context.getHandler();
    const options = Reflect.getMetadata('cookieOptions', handler);
    request._cookies = [];
    return next
      .handle()
      .toPromise()
      .then(res => {
        if (request._cookies) {
          for (const cookie of request._cookies) {
            const cookieOptions = cookie.options
              ? cookie.options
              : options
              ? options
              : {};
            if (cookie.value) {
              response.cookie(cookie.name, cookie.value, cookieOptions);
            } else {
              response.clearCookie(cookie.name);
            }
          }
        }
        return res || undefined;
      });
  }
}
