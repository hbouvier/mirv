/* eslint no-console: 0 */
'use strict';
const cryptoImpl = require('crypto'),
      instance   = require('./instance');

module.exports = function (_config, logger) {
  const config = _config || {};

  function hmac(payload, _key) {
    const key = _key || (config.key);
    if (!key) {
      throw new Error(`crypto.hmac(${mask(payload)}): Encryption key is 'undefined' has parameter to the function and in the module configuration!`);
    }

    const hmac = cryptoImpl.createHmac('sha1', key);
    const hash = hmac.update(payload, 'utf8'); //.digest('base64')
    return hash.digest('hex').toUpperCase();
  }

  function uuidgen() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  function mask(s) {
    return s.toString().replace(/./g,'X');
  }

  return {
    hmac:    hmac,
    uuidgen: uuidgen,
    mask:    mask
  };
};
