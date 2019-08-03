import { createParamDecorator } from '@nestjs/common';

/**
 * Route handler parameter decorator.  Extracts all cookies, or a
 * named cookie from the `cookies` object and populates the decorated
 * parameter with that value.
 *
 * @param data (optional) string containing name of cookie to extract
 * If omitted, all cookies will be extracted.
 */
export const Cookies = createParamDecorator((data, req) => {
  return data ? req.cookies && req.cookies[data] : req.cookies;
});

/**
 * Route handler parameter decorator.  Extracts all signed cookies, or a
 * named signed cookie from the `signedCookies` object and populates the decorated
 * parameter with that value.
 *
 * @param data (optional) string containing name of signed cookie to extract
 * If omitted, all signed cookies will be extracted.
 */
export const SignedCookies = createParamDecorator((data, req) => {
  return data
    ? req.signedCookies && req.signedCookies[data]
    : req.signedCookies;
});
