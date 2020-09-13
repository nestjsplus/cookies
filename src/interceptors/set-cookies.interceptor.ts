import 'reflect-metadata';
import unionBy = require('lodash/unionBy');
import { CookieSettings } from '../interfaces';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const handler = context.getHandler();
    const options = Reflect.getMetadata('cookieOptions', handler);
    const cookies = Reflect.getMetadata('cookieSettings', handler);
    request._cookies = [];
    return next.handle().pipe(
      tap(() => {
        const allCookies = unionBy(
          request._cookies,
          cookies,
          item => item.name,
        ) as CookieSettings[];
        for (const cookie of allCookies) {
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
      }),
    );
  }
}
