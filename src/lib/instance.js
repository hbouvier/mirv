export function typeOf(obj) {
  const type = Object.prototype.toString.call(obj);
  return type.slice(8, -1).toLowerCase();
}

export function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isUUID(uuid) {
  return uuid.match(/^[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+$/i) !== null;
}

export function isUndefined(value) {
  return typeOf(value) === 'undefined';
}

export function isArray(value) {
  return typeOf(value) === 'array';
}

export function isObject(value) {
  return typeOf(value) === 'object';
}

export function isString(value) {
  return typeOf(value) === 'string';
}

export const range = end => [...Array(end).keys()];
