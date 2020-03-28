import 'reflect-metadata';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class ClearCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type = context.getType<string>();

    let res: Response;

    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      res = gqlCtx.res;
    } else if (type === 'http') {
      res = context.switchToHttp().getResponse();
    } else {
      throw new Error('unsupported context');
    }

    const handler = context.getHandler();
    const cookieNames = [].concat(Reflect.getMetadata('cookieNames', handler));

    if (cookieNames) {
      for (const name of cookieNames) {
        res.clearCookie(name);
      }
    }

    return next.handle();
  }
}
