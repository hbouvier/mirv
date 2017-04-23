/* eslint no-console: off */
import * as http from 'http';
import * as https from 'https';
import { parseURL } from './url';

export function get(requestUrl, headers, debug = false) {
  return request('GET', requestUrl, undefined, headers, debug);
}

export function post(requestUrl, payload, headers, debug = false) {
  return request('POST', requestUrl, payload, headers, debug);
}

export function put(requestUrl, payload, headers, debug = false) {
  return request('PUT', requestUrl, payload, headers, debug);
}

export function del(requestUrl, payload, headers, debug = false) {
  return request('DELETE', requestUrl, payload, headers, debug);
}

export function basicAuth(username, password) {
  const auth = new Buffer(`${username}:${password}`).toString('base64');
  return {
    Authorization: `Basic ${auth}`,
  };
}

function request(method, requestUrl, payload, headers, debug) {
  return new Promise((resolve, reject) => {
    const urlParsed = parseURL(requestUrl);
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
    if (debug) {
      console.log(`${method} ${requestUrl}`);
      Object.keys(postRequest.headers).forEach(key => console.log(`\t${key}\t\t:\t${postRequest.headers[key]}`));
      if (payload) {
        console.log(`\tDetected-Content-Type\t\t:\t${typeof payload}`);
        console.log('\n');
        console.log(payload);
      }
    }
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
        if (response.statusCode < 200 || response.statusCode > 299) {
          return reject(new Error(`{"error":"HTTP/POST Failed to complete request","code":${response.statusCode},"body":${bodyJoined === '' ? '""' : bodyJoined}}`));
        }
        return resolve(bodyJoined);
      });
    });
    // handle connection errors of the requestHandle
    requestHandle.on('error', (err) => {
      // console.log('error:', err);
      reject(err);
    });
    if (typeof payload !== 'undefined') {
      requestHandle.write(payload);
    }
    requestHandle.end();
  });
}
