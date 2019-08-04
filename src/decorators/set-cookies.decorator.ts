import { UseInterceptors, SetMetadata } from '@nestjs/common';
import { SetCookiesInterceptor } from '../interceptors/set-cookies.interceptor';
import { CookieOptions, CookieSettings } from '../interfaces';

/**
 * Request method decorator.  Causes decorated method to set cookies if specified
 * in method.
 *
 * @param options (Optional) Cookie Options.  If set, supplies default
 * options for all cookies set within the decorated method.
 *
 * @param cookies (Optional) Cookie Settings.  If set, supplies default
 * values for all cookies set within the decorated method.
 *
 * Decorated method may set `req._cookies` with array of `CookieSettings` to
 * be set upon completion of method execution.
 *
 * `CookieSettings` interface:
 *
 * ```typescript
 * interface CookieSettings {
 * // name of the cookie.
 * name: string;
 * // value of the cookie.
 * value ?: string;
 * //cookie options.
 * options ?: CookieOptions;
 * }
 * ```
 *
 * Note: due to render issues, we substituted <at> for the actual
 * &#64; character in the example below.
 *
 * @example
 * <at>Get('set')
 * <at>SetCookies()
 * set(<at>Request() req, <at>Query() query): any {
 *   const value = query.test ? query.test : this.appService.getHello();
 *   req._cookies = [
 *     { name: 'cookie1', value },
 *     { name: 'cookie2', value: 'c2 value' },
 *   ];
 *   return `cookie1 set to ${value}, cookie2 set to 'c2 value'`;
 * }
 *
 */
export function SetCookies(
  options?: CookieOptions | CookieSettings | CookieSettings[],
);
/**
 * Request method decorator.  Causes decorated method to set cookies if specified
 * in method.
 *
 * @param options (Optional) Cookie Options.  If set, supplies default
 * options for all cookies set within the decorated method.
 *
 * @param cookies (Optional) Cookie Settings.  If set, supplies default
 * values for all cookies set within the decorated method.
 *
 * Decorated method may set `req._cookies` with array of `CookieSettings` to
 * be set upon completion of method execution.
 *
 * `CookieSettings` interface:
 *
 * ```typescript
 * interface CookieSettings {
 * // name of the cookie.
 * name: string;
 * // value of the cookie.
 * value ?: string;
 * //cookie options.
 * options ?: CookieOptions;
 * }
 * ```
 *
 * Note: due to render issues, we substituted <at> for the actual
 * &#64; character in the example below.
 *
 * @example
 * <at>Get('set')
 * <at>SetCookies()
 * set(<at>Request() req, <at>Query() query): any {
 *   const value = query.test ? query.test : this.appService.getHello();
 *   req._cookies = [
 *     { name: 'cookie1', value },
 *     { name: 'cookie2', value: 'c2 value' },
 *   ];
 *   return `cookie1 set to ${value}, cookie2 set to 'c2 value'`;
 * }
 *
 */
export function SetCookies(
  options: CookieOptions,
  cookies: CookieSettings | CookieSettings[],
);
/**
 * Request method decorator.  Causes decorated method to set cookies if specified
 * in method.
 *
 * @param options (Optional) Cookie Options.  If set, supplies default
 * options for all cookies set within the decorated method.
 *
 * @param cookies (Optional) Cookie Settings.  If set, supplies default
 * values for all cookies set within the decorated method.
 *
 * Decorated method may set `req._cookies` with array of `CookieSettings` to
 * be set upon completion of method execution.
 *
 * `CookieSettings` interface:
 *
 * ```typescript
 * interface CookieSettings {
 * // name of the cookie.
 * name: string;
 * // value of the cookie.
 * value ?: string;
 * //cookie options.
 * options ?: CookieOptions;
 * }
 * ```
 *
 * Note: due to render issues, we substituted <at> for the actual
 * &#64; character in the example below.
 *
 * @example
 * <at>Get('set')
 * <at>SetCookies()
 * set(<at>Request() req, <at>Query() query): any {
 *   const value = query.test ? query.test : this.appService.getHello();
 *   req._cookies = [
 *     { name: 'cookie1', value },
 *     { name: 'cookie2', value: 'c2 value' },
 *   ];
 *   return `cookie1 set to ${value}, cookie2 set to 'c2 value'`;
 * }
 *
 */
export function SetCookies(
  options?: CookieOptions | CookieSettings | CookieSettings[],
  cookies?: CookieSettings | CookieSettings[],
) {
  return (target, propertyKey, descriptor) => {
    if (options) {
      // since we're overloaded, and first param could be either options or
      // cookies, must check which it is
      if (!Array.isArray(options) && !options.hasOwnProperty('name')) {
        // first param must be an options object
        SetMetadata('cookieOptions', options)(target, propertyKey, descriptor);
      } else {
        // first param is a cookies object
        cookies = [].concat(options) as CookieSettings[];
      }
    }

    if (cookies) {
      SetMetadata('cookieSettings', [].concat(cookies))(
        target,
        propertyKey,
        descriptor,
      );
    }
    UseInterceptors(SetCookiesInterceptor)(target, propertyKey, descriptor);
  };
}
