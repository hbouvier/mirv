/* eslint no-console: 0 */
'use strict';
const instance = require('./instance');

module.exports = function (req, res, next) {
  if (req && req.body && instance.of(req.body) === 'array') {
    req.body = req.body.reduce(function (acc, val) {
      const key = Object.keys(val)[0];
      acc[key] = val[key];
      return acc;
    }, {});
  }
  return next();
}
