import { UseInterceptors, SetMetadata } from '@nestjs/common';
import { SetCookiesInterceptor } from '../interceptors/set-cookies.interceptor';
import { CookieOptions } from '../interfaces';

/**
 * Request method decorator.  Causes decorated method to set cookies if specified
 * in method.
 *
 * @param options (Optional) Cookie settings.  If set, supplies default
 * options for all cookies set within the decorated method.
 *
 * Decorated method must set `req._cookies` with array of `CookieSettings` to
 * be set upon completion of method execution.
 *
 * `CookieSettings` interface:
 *
 * ```typescript
 * interface CookieSettings {
 * // name of the cookie.
 * name: stringg;
 * // value of the cookie.
 * value ?: string;
 * //cookie options.
 * options ?: CookieOptions;
 * }
 * ```
 *
 * Example:
 * ```typescript
 * <at>Get('set')
 * <at>SetCookies()
 * set(@Request() req, @Query() query): any {
 *   const value = query.test ? query.test : this.appService.getHello();
 *   req._cookies = [
 *     { name: 'cookie1', value },
 *     { name: 'cookie2', value: 'c2 value' },
 *   ];
 *   return `cookie1 set to ${value}, cookie2 set to 'c2 value'`;
 * }
 * ```
 *
 */
export const SetCookies = (options?: CookieOptions) => {
  return (target, propertyKey, descriptor) => {
    if (options) {
      SetMetadata('cookieOptions', options)(target, propertyKey, descriptor);
    }
    UseInterceptors(SetCookiesInterceptor)(target, propertyKey, descriptor);
  };
};
