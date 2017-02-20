/* eslint no-console: 0 */
'use strict';

const http  = require('http'),
      https = require('https'),
      url   = require('./url');

module.exports = {
  get:        get,
  put:        put,
  post:       post,
  delete:     del,
  basic_auth: basic_auth
}

function get(request_url, headers, debug = false) {
  return request('GET', request_url, undefined, headers, debug);
}
function post(request_url, payload, headers, debug = false) {
  return request('POST', request_url, payload, headers, debug);
}
function put(request_url, payload, headers, debug = false) {
  return request('PUT', request_url, payload, headers, debug);
}
function del(request_url, payload, headers, debug = false) {
  return request('DELETE', request_url, payload, headers, debug);
}

function request(method, request_url, payload, headers, debug) {
  return new Promise((resolve, reject) => {
    const url_parsed = url.parse(request_url);
    const http_s = url_parsed.protocol === 'http' ? http : https;
    const post_request = {
      host:   url_parsed.host,
      port:   url_parsed.port,
      method: method,    
      path:   url_parsed.path,
      agent:  false,
      headers : Object.assign({},
                  typeof payload === 'undefined' ? {} :
                    {
                      'Content-Type': 'application/json; charset=UTF-8',
                      'Content-Length': Buffer.byteLength(payload)
                    },
                  (headers || {})
                )
    };
    if (debug) {
      console.log('type-payload:', typeof payload);
      console.log('payload:', payload);
      console.log('request:', post_request);
    }
    const request = http_s.request(post_request, (response) => {
      response.setEncoding('utf8');

      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => {
        body.push(chunk)
      });
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          const payload = body.join('');
          return reject(new Error(`{"error":"HTTP/POST Failed to complete request","code":${response.statusCode},"body":${payload === '' ? '""' : payload}}`));
        }
        resolve(body.join(''))
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => {
      // console.log('error:', err);
      reject(err)
    });
    if (typeof payload !== 'undefined') {
      request.write(payload);
    }
    request.end();
  });
}

function basic_auth(username, password) {
  return {
    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
  };
}

