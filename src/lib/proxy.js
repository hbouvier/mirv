import * as http from 'http';
import * as https from 'https';
import debug from 'debug';
import { parseURL } from './url';
import { retry } from './promises';

let log = { info: debug('mirv:proxy') };

export default {
  get,
  post,
  put,
  del,
  statusOK,
  status,
  json,
  configure: ({ logger }) => { log = logger('mirv:proxy'); }
};

export function basicAuth(username, password) {
  const auth = new Buffer(`${username}:${password}`).toString('base64');
  return {
    Authorization: `Basic ${auth}`,
  };
}

export function get(args) {
  return requestWithRetries(Object.assign({}, args, { method: 'GET', started: Date.now() }));
}

export function post(args) {
  return requestWithRetries(Object.assign({}, args, { method: 'POST', started: Date.now() }));
}

export function put(args) {
  return requestWithRetries(Object.assign({}, args, { method: 'PUT', started: Date.now() }));
}

export function del(args) {
  return requestWithRetries(Object.assign({}, args, { method: 'DELETE', started: Date.now() }));
}

function requestWithRetries(args) {
  const nbRetries = args.retries || 1;
  const delays = Array.from(new Array(nbRetries), () => 1);
  return retry((attempt, delay) => request(attempt, delay, args), delays);
}

class Result {
  constructor({ method, url, response, rawBody, started }) {
    this.method = method;
    this.url = url;
    this.statusCode = response.statusCode;
    this.rawBody = rawBody;
    this.elapsed = Date.now() - started;
  }
  json() { return JSON.parse(this.rawBody); }
  text() { return this.rawBody; }
}

function request(attempt, delay, args) {
  const { method, url, payload, headers, timeout = 120000 } = args;
  return new Promise((resolve, reject) => {
    const urlParsed = parseURL(url);
    const httpOrHttps = urlParsed.protocol === 'http' ? http : https;
    const postRequest = {
      host:   urlParsed.host,
      port:   urlParsed.port,
      method,
      path:   urlParsed.path,
      agent:  false,
      headers : Object.assign({},
                  typeof payload === 'undefined' ? {} :
                  {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Content-Length': Buffer.byteLength(payload),
                  },
                  (headers || {}),
                ),
    };

    log.info(`${method} ${url}`);
    Object.keys(postRequest.headers).forEach(key => log.info(`\t${key}\t\t:\t${postRequest.headers[key]}`));
    if (payload) {
      log.info(`\tDetected-Content-Type\t\t:\t${typeof payload}\n${payload}`);
    }
    try {
      const requestHandle = httpOrHttps.request(postRequest, (response) => {
        response.setEncoding('utf8');

        // temporary data holder
        const body = [];
        // on every content chunk, push it to the data array
        response.on('data', (chunk) => {
          body.push(chunk);
        });
        // we are done, resolve promise with those joined chunks
        response.on('end', () => {
          const bodyJoined = body.join('');
          return resolve(
            new Result({
              method,
              url: urlParsed,
              response,
              rawBody: bodyJoined,
              started: args.started
            })
          );
        });
      });

      requestHandle.on('socket', (socket) => {
        socket.setTimeout(timeout);
        socket.on('timeout', () => {
          log.info(`HTTP/request timed out [${attempt + 1}]`);
          requestHandle.abort();
        });
      });

      // handle connection errors of the requestHandle
      requestHandle.on('error', (err) => {
        reject(new MirvRequestError({
          message: err.message,
          statusCode: 597,
          rawBody: ''
        }));
      });
      if (typeof payload !== 'undefined') {
        requestHandle.write(payload);
      }
      requestHandle.end();
    } catch (err) {
      log.info('catch(err):', err);
      reject(new MirvRequestError({
        message: err.message,
        statusCode: 597,
        rawBody: ''
      }));
    }
  });
}

const statusNotOK = response => response.statusCode < 200 || response.statusCode > 299;

const status = ({ predicate = statusNotOK }) => response =>
  new Promise((resolve, reject) => {
    if (predicate(response.statusCode)) {
      return reject(new MirvRequestError({
        message: `HTTP/${response.statusCode} ${response.method} ${response.url.path}`,
        statusCode: response.statusCode,
        rawBody: response.rawBody
      }));
    }
    return resolve(response);
  });

export const statusOK = status({ predicate: statusNotOK });

export const json = (response) => {
  try {
    const obj = JSON.parse(response.rawBody);
    return Promise.resolve(obj);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const info = msg => (value) => { log.info(`${msg}: ${value}`); return value; };

export function MirvRequestError({ message, statusCode, rawBody }) {
  this.name = 'MirvRequestError';
  this.message = message || 'HTTP Request ERROR';
  this.stack = (new Error()).stack;
  this.statusCode = statusCode;
  this.rawBody = rawBody;
}

MirvRequestError.prototype = Object.create(Error.prototype);
MirvRequestError.prototype.constructor = MirvRequestError;

