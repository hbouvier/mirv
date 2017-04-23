/* eslint no-undef: off */

import * as instance from '../lib/instance';

describe('Instance library', () => {
  it('instance of "hello" to return string', () => {
    expect(instance.typeOf('hello')).toBe('string');
  });

  it('instance of 42 to return number', () => {
    expect(instance.typeOf(42)).toBe('number');
  });

  it('instance of 4.2 to return number', () => {
    expect(instance.typeOf(4.2)).toBe('number');
  });

  it('instance of [1,2,3] to return array', () => {
    expect(instance.typeOf([1, 2, 3])).toBe('array');
  });

  it('is_numeric of an interger', () => {
    expect(instance.isNumeric(42)).toBe(true);
  });

  it('is_uuid', () => {
    expect(instance.isUUID('FF123A2A-D1CF-4EE2-95EC-C654EC8EAE3A'.toLowerCase())).toBe(true);
  });

  it('range', () => {
    expect(instance.range(5)).toEqual([0, 1, 2, 3, 4]);
  });
});
