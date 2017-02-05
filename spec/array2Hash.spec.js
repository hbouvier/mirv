/* eslint no-console: 0 */
'use strict';

const array2hash = require('../lib/array2hash');
describe("Array to Hash", () => {
  it("array of tuple converted to object", () => {
    var req = {body:[{key: 'value'}, {something: 'else'}]};
    array2hash(req, {}, ()=>{});
    expect(req.body).toEqual({key: 'value', something: 'else'});
  });
});
