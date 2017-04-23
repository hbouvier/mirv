/* eslint no-undef: off */
import * as promises from '../lib/promises';
import * as instance from '../lib/instance';

describe('promises', () => {
  it('json of a valid string to resolve', (done) => {
    const object = { key:'value' };
    promises.json(JSON.stringify(object))
      .then((obj) => {
        expect(obj).toEqual(object);
        done();
      })
      .catch((err) => {
        expect(instance.typeOf(err)).toBe('undefined');
        done();
      });
  });

  it('json of in invalid json to reject', (done) => {
    promises.json('{asd}')
      .then((obj) => {
        expect(obj).not.toEqual(object);
        done();
      })
      .catch((err) => {
        expect(instance.typeOf(err.message)).not.toBe('undefined');
        done();
      });
  });

  function failXtimes(x) {
    let count = 0;
    return () => {
      count += 1;
      if (count <= x) {
        return Promise.reject(new Error(`${count}`));
      }
      return Promise.resolve(count);
    };
  }

  it('retry is expected to succeed', (done) => {
    promises.retry(failXtimes(1), [1, 1, 1])
      .then((count) => {
        expect(count).toBe(2);
        done();
      })
      .catch((err) => {
        expect(instance.typeOf(err)).toBe('undefined');
        done();
      });
  });

  it('retry is expected to succeed', (done) => {
    promises.retry(failXtimes(4), [1, 1, 1])
      .then((count) => {
        expect(count).toBe('not going to happen!');
        done();
      })
      .catch((err) => {
        expect(err.message).toBe('3');
        done();
      });
  });

  it('serialize resolve promises sequentially', (done) => {
    const delays = [100, 0];
    const arrayOfFunctionsThatReturnPromise = delays.map(delay => () => new Promise((resolve) => {
      setTimeout(() => resolve(delay), delay);
    }));

    promises.serialize(arrayOfFunctionsThatReturnPromise)
    .then((results) => {
      results.forEach((result, index) => expect(result).toBe(delays[index]));
      done();
    })
    .catch((err) => {
      expect(err.message).toBe('no error');
      done();
    });
  });
});
