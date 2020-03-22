import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './src/app.module';
import { join } from 'path';
import * as CookieParser from 'cookie-parser';

let agent;

let saveCookie1;

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use(CookieParser('secret'));
    app.setBaseViewsDir(join(__dirname, 'views'));
    app.setViewEngine('hbs');

    await app.init();

    agent = request(app.getHttpServer());
  });

  it('/set should set cookie1, cookie2', async () => {
    return await agent
      .get('/set')
      .expect(200)
      // tslint:disable-next-line: quotemark
      .expect("cookie1 set to 'Hello World!', cookie2 set to 'c2 value'")
      .expect(res => {
        expect(res.header['set-cookie']).toHaveLength(2);
        saveCookie1 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie1'),
        );
        expect(saveCookie1).toMatch(/s%3AHello%20World!/);
        expect(saveCookie1).toMatch(/SameSite=Strict/);

        const cookie2 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie2'),
        );
        expect(cookie2).toMatch(/c2%20value/);
      });
  });

  it('/cookieSet1 should set cookie3, cookie4', async () => {
    return await agent
      .get('/cookieSet1')
      .expect(200)
      .expect(res => {
        const cookie3 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie3'),
        );
        const cookie4 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie4'),
        );
        expect(cookie3).toMatch(/cookie3%20value/);
        expect(cookie4).toMatch(/cookie4%20value/);
      });
  });

  it('/cookieSet2 should set cookie1, cookie3, cookie4', async () => {
    return await agent
      .get('/cookieSet2')
      .expect(200)
      .expect(res => {
        const cookie1 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie1'),
        );
        const cookie3 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie3'),
        );
        const cookie4 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie4'),
        );
        expect(cookie1).toMatch(/cookie1%20value/);
        expect(cookie3).toMatch(/cookie3%20value/);
        expect(cookie4).toMatch(/cookie4%20value/);
      });
  });

  it('/cookieSet3 should override cookie3, set cookie4', async () => {
    return await agent
      .get('/cookieSet3')
      .expect(200)
      .expect(res => {
        const cookie3 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie3'),
        );
        const cookie4 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie4'),
        );
        expect(cookie3).toMatch(/overridden/);
        expect(cookie4).toMatch(/cookie4%20value/);
      });
  });

  it('/cookieSet4 should set cookie3, cookie4 with httpOnly', async () => {
    return await agent
      .get('/cookieSet4')
      .expect(200)
      .expect(res => {
        const cookie3 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie3'),
        );
        const cookie4 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie4'),
        );
        expect(cookie3).toMatch(/cookie3%20value/);
        expect(cookie4).toMatch(/cookie4%20value/);
        expect(cookie3).toMatch(/HttpOnly/);
        expect(cookie4).toMatch(/HttpOnly/);
      });
  });

  it('/dget should get cookie sent', async () => {
    const testCookieName = 'cookie1';
    const testCookieVal = 'mycookie';
    const testCookieHeader = `${testCookieName}=${testCookieVal}`;
    const testCookieResponse = {};
    testCookieResponse[testCookieName] = testCookieVal;
    return await agent
      .get('/dget')
      .set('cookie', testCookieHeader)
      .expect(200)
      .expect(testCookieResponse);
  });

  it('/sget should get signed cookie sent', async () => {
    return await agent
      .get('/sget')
      .set('cookie', saveCookie1)
      .expect(200)
      .expect('Hello World!');
  });

  it('/defaults should set def1, def2 cookies', async () => {
    return await agent
      .get('/defaults')
      .expect(200)
      // tslint:disable-next-line: quotemark
      .expect("def1 set to 'Hello World!', def2 set to 'c2 value'")
      .expect(res => {
        const def1 = res.header['set-cookie'].find(
          cookie => cookie.substring(0, 4) === 'def1',
        );
        expect(def1).toMatch(/Hello%20World!/);
        expect(def1).toMatch(/SameSite=Strict/);
        expect(def1).toMatch(/Expires=Fri, 01 Feb 2030 01:01:00 GMT;/);
      });
  });

  it('/clear should clear cookie1, render response', async () => {
    return await agent
      .get('/clear')
      .expect(200)
      .expect(res => {
        const cookie1 = res.header['set-cookie'].find((cookie: string) =>
          cookie.includes('cookie1'),
        );
        expect(res.text).toMatch(/<h2>cookies cleared!<\/h2>/);
        expect(cookie1).toMatch(/cookie1=;/);
      });
  });
});
