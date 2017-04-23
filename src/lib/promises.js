/*
 * promiseSerial resolves Promises sequentially.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * const funcs = urls.map(url => () => $.ajax(url))
 *
 * serialize(funcs)
 *   .then(console.log)
 *   .catch(console.error)
 */
export const serialize = funcs =>
  funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]));


export function json(buffer) {
  try {
    const obj = JSON.parse(buffer);
    return Promise.resolve(obj);
  } catch (err) {
    return Promise.reject(err);
  }
}

export function retry(f, intervals) {
  return new Promise((resolve, reject) => {
    function retryImpl(retryIntervals) {
      const delay = retryIntervals[0];
      const newIntervals = retryIntervals.slice(1);
      f()
        .then(result => resolve(result))
        .catch((err) => {
          if (newIntervals.length === 0) {
            reject(err);
          } else {
            setTimeout(() => { retryImpl(newIntervals); }, delay);
          }
        });
    }
    retryImpl(intervals);
  });
}

