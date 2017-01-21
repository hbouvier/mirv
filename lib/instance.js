/* eslint no-console: 0 */
'use strict';

exports.of = function (obj) {
  const type = Object.prototype.toString.call(obj);
  return type.slice(8, -1).toLowerCase();
};

exports.is_numeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

exports.is_uuid = function (uuid) {
  return uuid.match(/^[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+$/) !== null;
};
