/* eslint no-console: 0 */
'use strict';

const promises = require('../lib/promises');
const instance = require('../lib/instance');

describe("promises", () => {
  it("json of a valid string to resolve", (done) => {
    const object = {key:"value"};
    promises.json(JSON.stringify(object))
      .then(obj => {
        expect(obj).toEqual(object)
        done();
      })
      .catch(err => {
        expect(instance.of(err)).toBe('undefined');
        done();
      });
  });

  it("json of in invalid json to reject", (done) => {
    promises.json('{asd}')
      .then(obj => {
        expect(obj).not.toEqual(object)
        done();
      })
      .catch(err => {
        expect(instance.of(err.message)).not.toBe('undefined')
        done();
      });
  });

  function fail_x_times(x) {
    var count = 0;
    return () => {
      ++count;
      if(count <= x) {
        return Promise.reject(new Error(`${count}`));
      }
      return Promise.resolve(count);
    }
  }

  it("retry is expected to succeed", (done) => {
    promises.retry(fail_x_times(1), [1,1,1])
      .then(count => {
        expect(count).toBe(2);
        done();
      })
      .catch(err => {
        expect(instance.of(err)).toBe('undefined');
        done();
      });
  });

  it("retry is expected to succeed", (done) => {
    promises.retry(fail_x_times(4), [1,1,1])
      .then(count => {
        expect(count).toBe("not going to happen!")
        done();
      })
      .catch(err => {
        expect(err.message).toBe('3')
        done();
      });
  });
});
