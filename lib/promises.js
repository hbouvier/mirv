/* eslint no-console: 0 */
'use strict';
const instance = require('./instance');

module.exports = {
  json:  json,
  retry: retry
};

function json(buffer) {
  try {
    const obj = JSON.parse(buffer);
    return Promise.resolve(obj);
  } catch (err) {
    return Promise.reject(err);
  }
}


function retry(f, intervals) {
  return new Promise( (resolve, reject) => {  
    function _retry(intervals) {
      const delay = intervals[0];
      const newIntervals = intervals.slice(1);
      f()
        .then(result => resolve(result))
        .catch(err => {
          if (newIntervals.length === 0)
            reject(err);
          else
            setTimeout(() => {_retry(newIntervals);}, delay);
        });
    }
    _retry(intervals);
  });
}
