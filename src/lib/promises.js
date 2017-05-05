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

/*
 * retry Call a function that returns a promise, if it fails, wait a
 *       predefined delay before retrying it.
 * @example
 * const delays = [50, 100, 250, 500, 1000, 2000, 3000]; // Total of 7 seconds
 *
 * retry((attempt, delay) => {
 *   console.log(`Attempt ${attempt} of ${delays.length}`);
 *   console.log(`If promise fails, next attempt will be in ${delay} ms.`);
 *   return http.get('www.google.com'), delays);
 * })
 * .then(console.log)
 * .catch(console.error)
 *
 */
export function retry(f, intervals) {
  const maxRetries = intervals.length;
  return new Promise((resolve, reject) => {
    function retryImpl(retryIntervals) {
      const delay = retryIntervals[0];
      const newIntervals = retryIntervals.slice(1);
      f(maxRetries - retryIntervals.length, delay)
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

