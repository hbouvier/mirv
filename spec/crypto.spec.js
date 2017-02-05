/* eslint no-console: 0 */
'use strict';

const config = {};
const logger = {info: console.log};
const crypto = require('../lib/crypto')(config, logger);

describe("Cryptographic library", () => {
  // hmac
  it("hmac should throw an exception when no key is provided", () => {
    expect(() => crypto.hmac('hello world')).toThrowError(/Encryption key is 'undefined'/);
  });

  it("hmac should encrypt string", () => {
    const payload = 'hello world';
    const sha1 = crypto.hmac(payload, 'secret-key');
    expect(payload).not.toBe(sha1);
  });


  // uuidgen
  it("uuid should be 36 bytes", () => {
    const uuid = crypto.uuidgen();
    expect(uuid.length).toBe(36);
  });
  it("uuid should have 4 dashes", () => {
    const uuid = crypto.uuidgen();
    expect(uuid.split('').filter(c=>c==='-').length).toBe(4);
  });
  it("uuid should have 4 at position 15", () => {
    const uuid = crypto.uuidgen();
    expect(uuid.charAt(14)).toBe('4');
  });

  // mask
  it("mask should replace all characters with X", () => {
    expect(crypto.mask('Secret')).toBe('XXXXXX');
  });
});
