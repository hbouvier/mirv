/* eslint no-undef: off */
import { toUnicode } from '../lib/codec';

describe('Codec library', () => {
  it('expect "hello 😬" to be hello \ud83d\ude2c', () => {
    expect(toUnicode('hello 😬')).toBe('hello \\ud83d\\ude2c');
  });
});
