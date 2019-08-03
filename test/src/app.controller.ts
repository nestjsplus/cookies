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
  dget(@Request() req, @Cookies() cookies) {
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
