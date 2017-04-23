/* eslint no-mixed-operators: off */
export const map = f => x => Array.prototype.map.call(x, f);
export const flatMap = f => x => map(f)(flatten(x));
export const flatten = x => x.reduce((acc, value) =>
                              acc.concat(Array.isArray(value) ? flatten(value) : value),
                              []);

// export function* range(fromNumber, toNumber) {
//   for (let i = fromNumber; i <= toNumber; i += 1) yield i;
// }
export const range = (from, to) => {
  const { offset, size } =
    typeof to === 'undefined'
      ? { offset: 0, size: from }
      : { offset: from, size: to - from + 1 };
  return [...Array(size).keys()].map(x => x + offset);
};

// export const compose = (...fns) => foldLeft(compose2)(fns);
export const pipeline = (...fns) => foldRight(compose2)(fns);
export const compose2 = (x, y) => z => x(y(z));

// export const foldLeft = f => (iterable, init) => {
//   const iterator = iterable[Symbol.iterator]();
//   const { value, done } = iterator.next();
//   let acc = typeof init === 'undefined'
//           ? value // if value is undefined, we should throw
//           : init;
//   if (done) return acc;
//   acc = typeof init === 'undefined'
//       ? acc
//       : f(acc, value);
//   for (const nextValue of iterator) {
//     acc = f(acc, nextValue);
//   }
//   return acc;
// };


export const foldRight = f => (iterable, init) => {
  const iterator = iterable[Symbol.iterator]();
  const { value, done } = iterator.next();
  if (done) {
    if (typeof init !== 'undefined') return init;
    return undefined;
  }
  const acc = foldRight(f)(iterator, init);
  if (typeof acc === 'undefined') return value;
  return f(acc, value);
};
