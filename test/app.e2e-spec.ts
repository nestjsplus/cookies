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
        saveCookie1 = res.header['set-cookie'].find(
          cookie => cookie.substring(0, 7) === 'cookie1',
        );
        expect(saveCookie1).toMatch(/s%3AHello%20World!/);
        expect(saveCookie1).toMatch(/SameSite=Strict/);

        const cookie2 = res.header['set-cookie'].find(
          cookie => cookie.substring(0, 7) === 'cookie2',
        );
        expect(cookie2).toMatch(/c2%20value/);
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
        const cookie1 = res.header['set-cookie'].find(
          cookie => cookie.substring(0, 7) === 'cookie1',
        );
        expect(res.text).toMatch(/<h2>cookies cleared!<\/h2>/);
        expect(cookie1).toMatch(/cookie1=;/);
      });
  });
});
