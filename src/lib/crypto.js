/* eslint no-bitwise: [2, { allow: ["|", "&"] }] */
/* eslint no-mixed-operators: ["error", {"groups": [["^", "~", "<<", ">>", ">>>"]]}] */

import { createHmac } from 'crypto';
import { isUndefined } from './instance';

export function uuidgen() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0x00;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function mask(s) {
  return s.toString().replace(/./g, 'X');
}

export function hmac({ payload, key, algo = 'sha1', charset = 'utf8' }) {
  if (isUndefined(key)) {
    throw new Error(`crypto.hmac(${payload}): Encryption key is 'undefined'`);
  }
  const hmacAlgo = createHmac(algo, key);
  const hash = hmacAlgo.update(payload, charset);
  return hash.digest('hex');
}
