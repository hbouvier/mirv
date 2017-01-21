/* eslint no-console: 0 */
'use strict';

const codec = require('../lib/codec');

describe("Codec library", function() {
  it("expect 'hello 😬' to be hello \ud83d\ude2c", function() {
    expect(codec.to_unicode('hello 😬')).toBe('hello \\ud83d\\ude2c');
  });
});
