import 'reflect-metadata';
import unionBy = require('lodash/unionBy');
import { CookieSettings } from '../interfaces';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType<string>();

    let res: Response;
    let req;
    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      req = gqlCtx.req;
      res = gqlCtx.res;
    } else if (type === 'http') {
      req = context.switchToHttp().getRequest();
      res = context.switchToHttp().getResponse();
    } else {
      throw new Error('unsupported context');
    }

    const handler = context.getHandler();
    const options = Reflect.getMetadata('cookieOptions', handler);
    const cookies = Reflect.getMetadata('cookieSettings', handler);

    req._cookies = [];
    return next.handle().pipe(
      tap(() => {
        const allCookies = unionBy(
          req._cookies,
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
            res.cookie(cookie.name, cookie.value, cookieOptions);
          } else {
            res.clearCookie(cookie.name);
          }
        }
      }),
    );
  }
}
