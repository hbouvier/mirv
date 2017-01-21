/* eslint no-console: 0 */
'use strict';

exports.to_unicode = function (s) {
  return s.split('').map( c => {
    const code = c.charCodeAt(0);
    return code < 128 ? c : '\\' + 'u' + code.toString(16);
  }).join('');
};
