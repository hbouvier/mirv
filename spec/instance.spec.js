/* eslint no-console: 0 */
'use strict';

const instance = require('../lib/instance');

describe("Instance library", () => {
  it("instance of 'hello' to return string", () => {
    expect(instance.of('hello')).toBe('string');
  });

  it("instance of 42 to return number", () => {
    expect(instance.of(42)).toBe('number');
  });

  it("instance of 4.2 to return number", () => {
    expect(instance.of(4.2)).toBe('number');
  });

  it("instance of [1,2,3] to return array", () => {
    expect(instance.of([1,2,3])).toBe('array');
  });

  it("is_numeric of an interger", () => {
    expect(instance.is_numeric(42)).toBe(true);
  });

  it("is_uuid", () => {
    expect(instance.is_uuid('FF123A2A-D1CF-4EE2-95EC-C654EC8EAE3A'.toLowerCase())).toBe(true);
  });
});
