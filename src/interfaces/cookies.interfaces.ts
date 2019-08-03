/**
 * Interface defining options to set for cookie.
 *
 * @see [Express cookies](https://expressjs.com/en/api.html#res.cookie)
 */
export interface CookieOptions {
  /**
   * Domain name for the cookie.
   */
  domain?: string;
  /**
   * 	A synchronous function used for cookie value encoding. Defaults to encodeURIComponent.
   */
  encode?: (val: string) => string;
  /**
   * Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
   */
  expires?: Date;
  /**
   * Flags the cookie to be accessible only by the web server.
   */
  httpOnly?: boolean;
  /**
   * Convenient option for setting the expiry time relative to the current time in milliseconds.
   */
  maxAge?: number;
  /**
   * Path for the cookie. Defaults to “/”.
   */
  path?: string;
  /**
   * Marks the cookie to be used with HTTPS only.
   */
  secure?: boolean;
  /**
   * Indicates if the cookie should be signed.
   */
  signed?: boolean;
  /**
   * Value of the “SameSite” Set-Cookie attribute. More information at
   * https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1.
   */
  sameSite?: boolean | string;
}

/**
 * Interface defining the cookie itself.
 */
export interface CookieSettings {
  /**
   * name of the cookie.
   */
  name: string;
  /**
   * value of the cookie.
   */
  value?: string;
  /**
   * cookie options.
   */
  options?: CookieOptions;
}
