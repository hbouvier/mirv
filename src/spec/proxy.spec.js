/* eslint no-undef: off */
import express from 'express';
import { get, statusOK, json, MirvRequestError } from '../lib/proxy';

describe('proxy', () => {
  it('GET http://www.google.com', (done) => {
    get({ url: 'http://www.google.com' })
    .then((response) => { expect(response.statusCode).toBe(302); return response; })
    .then((response) => { expect(response.rawBody).toMatch(/^<HTML><HEAD>/); })
    .then(done)
    .catch((err) => { expect(err).toBeUndefined(); done(); });
  });
  it('GET http://g.za', (done) => {
    get({ url: 'http://g.za' })
    .then((response) => { expect(response).toBeUndefined(); })
    .then(done)
    .catch((err) => {
      expect(err instanceof MirvRequestError).toBe(true);
      expect(err.message).toMatch(/getaddrinfo ENOTFOUND g.za g.za:80/);
      done();
    });
  });
  it('GET http://127.0.0.1:65536', (done) => {
    get({ url: 'http://127.0.0.1:65536' })
    .then((response) => { expect(response).toBeUndefined(); done(); })
    .then(done)
    .catch((err) => {
      expect(err instanceof MirvRequestError).toBe(true);
      expect(err.message).toMatch(/option should be >= 0 and < 65536/);
      done();
    });
  });
  it('GET http://127.0.0.1:65535', (done) => {
    get({ url: 'http://127.0.0.1:65535' })
    .then((response) => { expect(response).toBeUndefined(); })
    .then(done)
    .catch((err) => {
      expect(err instanceof MirvRequestError).toBe(true);
      expect(err.message).toMatch(/connect ECONNREFUSED 127.0.0.1:65535/);
      done();
    });
  });
  it('GET http://127.0.0.1:65534', (done) => {
    const port = 65534;
    const app = express();
    const payload = { ok: true };
    let retries = 0;
    app.listen(port);
    app.get('/unresponsive', (req, res) => {
      if (retries < 2) {
        retries += 1;
      } else {
        res.json(payload).end();
      }
    });

    get({
      url: 'http://127.0.0.1:65534/unresponsive',
      timeout: 10,
      retries: 3
    })
    .then(statusOK)
    .then(json)
    .then((object) => { expect(object).toEqual(payload); })
    .then(() => { expect(retries).toBe(2); })
    .then(done)
    .catch((err) => { expect(err).toBeUndefined(); done(); });
  });

  it('json of a valid string to resolve', (done) => {
    const object = { rawBody: '{"key":"value"}' };
    json(object)
    .then((obj) => { expect(obj).toEqual(JSON.parse(object.rawBody)); })
    .then(done)
    .catch((err) => { expect(err).toBeUndefined(); done(); });
  });

  it('json of in invalid json to reject', (done) => {
    const object = { rawBody: '{ try to parse that! }' };
    json(object)
    .then((obj) => { expect(obj).toBeUndefined(); })
    .then(done)
    .catch((err) => { expect(err.message).toMatch(/Unexpected token t in JSON at position 2/); done(); });
  });
});
