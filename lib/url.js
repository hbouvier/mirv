/* eslint no-console: 0 */
'use strict';

exports.parse = function (url) {
  const regex_ = /^(http[s]?):\/\/(?:([^:\/]+):([^@\/]+)@)?([^\/:]+)(?::([^\/]+))?(?:(\/.*))?$/;
  const captured = url.match(regex_);
  if (captured !== null && captured[0] !== undefined && captured.length > 0) {
    return {
      protocol: captured[1],
      user:     captured[2],
      password: captured[3],
      host:     captured[4],
      port:     typeof captured[5] === 'undefined' ? (captured[1] === 'http' ? 80 : 443) : parseInt(captured[5]),
      path:     captured[6]
    };
  }
  throw new Error(`url.parse(${url}): INVALID URL FORMAT. Expected [http|https]://{user:pass@}host{:port}/path`);
};
