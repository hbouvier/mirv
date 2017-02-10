/* eslint no-console: 0 */
'use strict';

const http  = require('http'),
      https = require('https'),
      url   = require('./url');

module.exports = {
  get:    get,
  put:    put,
  post:   post,
  delete: del
}

function get(request_url) {
  return new Promise((resolve, reject) => {
    const url_parsed = url.parse(request_url);
    const http_s = url_parsed.protocol === 'http' ? http : https;
    const request = http_s.get(request_url, (response) => {
      response.setEncoding('utf8');
      if (response.statusCode < 200 || response.statusCode > 299) {
        return reject(new Error('HTTP/GET Failed to complete request, status code: ' + response.statusCode));
      }

      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(body.join('')));
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
  });
};

function post(request_url, body, headers) {
  return request('POST', request_url, body, headers);
}
function put(request_url, body, headers) {
  return request('PUT', request_url, body, headers);
}

function del(request_url, body, headers) {
  return request('DELETE', request_url, body, headers);
}

function request(method, request_url, body, headers) {
  console.log(method, request_url, body, headers);
  return new Promise((resolve, reject) => {
    const url_parsed = url.parse(request_url);
    const http_s = url_parsed.protocol === 'http' ? http : https;
    const post_request = {
      host:   url_parsed.host,
      port:   url_parsed.port,
      method: method,    
      path:   url_parsed.path,
      agent:  false,
      headers : Object.assign(
                  {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Content-Length': Buffer.byteLength(body)
                  },
                  (headers || {})
                )
    };
    console.log('request:', post_request);
    const request = http_s.request(post_request, (response) => {
      console.log('code:', response.statusCode);
      response.setEncoding('utf8');

      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {
        console.log('chunk:', chunk);
        body.push(chunk)
      });
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        console.log('END');
        if (response.statusCode < 200 || response.statusCode > 299) {
          const payload = body.join('');
          return reject(new Error(`{"error":"HTTP/POST Failed to complete request","code":${response.statusCode},"body":${payload === '' ? '""' : payload}}`));
        }
        resolve(body.join(''))
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => {
      console.log('error:', err);
      reject(err)
    });
    request.write(body);
    request.end();

  });
};
