/* eslint no-undef: off */
import { expressArray2hash } from '../lib/array2hash';

describe('array2hash', () => {
  it('array of tuple converted to object', () => {
    const req = { body:[{ key: 'value' }, { something: 'else' }] };
    expressArray2hash(req, {}, () => {});
    expect(req.body).toEqual({ key: 'value', something: 'else' });
  });
});
