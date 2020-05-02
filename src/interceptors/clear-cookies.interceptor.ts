import 'reflect-metadata';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class ClearCookiesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const handler = context.getHandler();
    const cookieNames = [].concat(Reflect.getMetadata('cookieNames', handler));
    const res$ = next.handle();
    return res$.toPromise().then(res => {
      if (cookieNames) {
        for (const name of cookieNames) {
          response.clearCookie(name);
        }
      }
      return res || undefined;
    });
  }
}
