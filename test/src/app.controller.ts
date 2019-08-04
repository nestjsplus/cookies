import {
  Controller,
  Get,
  Headers,
  Request,
  Query,
  Render,
} from '@nestjs/common';
import {
  SetCookies,
  ClearCookies,
  Cookies,
  SignedCookies,
} from '../../src/decorators';
import { CookieSettings } from '../../src/interfaces';

const tcookies: CookieSettings[] = [
  { name: 'cookie3', value: 'cookie3 value' },
  { name: 'cookie4', value: 'cookie4 value' },
];

@Controller()
export class AppController {
  @Get('set')
  @SetCookies()
  set(@Request() req, @Headers() headers, @Query() query): any {
    const value = query.test ? query.test : 'Hello World!';
    req._cookies = [
      {
        name: 'cookie1',
        value,
        options: {
          signed: true,
          sameSite: true,
        },
      },
      { name: 'cookie2', value: 'c2 value' },
    ];
    return `cookie1 set to '${value}', cookie2 set to 'c2 value'`;
  }

  @Get('defaults')
  @SetCookies({ httpOnly: true })
  setdef(@Request() req, @Headers() headers, @Query() query): any {
    const value = query.test ? query.test : 'Hello World!';
    req._cookies = [
      {
        name: 'def1',
        value,
        options: {
          expires: new Date(Date.UTC(2030, 1, 1, 1, 1)),
          sameSite: true,
        },
      },
      { name: 'def2', value: 'c2 value' },
    ];
    return `def1 set to '${value}', def2 set to 'c2 value'`;
  }

  // Delete cookies by passing empty value
  // also ensures that @Render still works (ensuring that "default" (platform-abstracted))
  // response functions work
  @SetCookies()
  @Get('clear')
  @Render('clear')
  clear(@Request() req) {
    req._cookies = [{ name: 'cookie1' }];
    return { message: 'cookies cleared!' };
  }

  @SetCookies(tcookies)
  @Get('cookieSet1')
  cookieSet1() {
    return;
  }

  @SetCookies(tcookies)
  @Get('cookieSet2')
  cookieSet2(@Request() req) {
    req._cookies = [{ name: 'cookie1', value: 'cookie1 value' }];
    return;
  }

  @SetCookies(tcookies)
  @Get('cookieSet3')
  cookieSet3(@Request() req) {
    req._cookies = [{ name: 'cookie3', value: 'overridden' }];
    return;
  }

  @SetCookies({ httpOnly: true }, tcookies)
  @Get('cookieSet4')
  cookieSet4() {
    return;
  }

  @ClearCookies('cookie1', 'cookie2')
  @Get('kill')
  @Render('clear')
  kill() {
    return { message: 'cookies killed!' };
  }

  @Get('show')
  show(@Request() req) {
    return req.cookies;
  }

  @Get('dget')
  dget(@Cookies() cookies) {
    return cookies;
  }

  @Get('sget')
  sget(@SignedCookies('cookie1') cookie1: any) {
    return cookie1;
  }

  @Get('signed')
  signed(@Request() req) {
    return req.signedCookies;
  }
}
