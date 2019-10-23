import { UseInterceptors, SetMetadata } from '@nestjs/common';
import { ClearCookiesInterceptor } from '../interceptors/clear-cookies.interceptor';

/**
 * Request method decorator.  Causes decorated method to clear
 * all named cookies.
 *
 * @param cookies List of cookie names to be cleared.
 *
 */
export function ClearCookies(...cookies: string[]) {
  return (target, propertyKey, descriptor) => {
    SetMetadata('cookieNames', cookies)(target, propertyKey, descriptor);
    UseInterceptors(ClearCookiesInterceptor)(target, propertyKey, descriptor);
  };
}
