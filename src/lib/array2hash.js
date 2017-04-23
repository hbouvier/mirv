import { isArray } from './instance';

export function expressArray2hash(req, res, next) {
  if (req && req.body && isArray(req.body)) {
    req.body = req.body.reduce((acc, val) => {
      const key = Object.keys(val)[0];
      acc[key] = val[key];
      return acc;
    }, {});
  }
  return next();
}

export default expressArray2hash;
