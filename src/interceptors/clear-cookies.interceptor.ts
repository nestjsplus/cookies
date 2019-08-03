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
