/* eslint no-undef: off */
import * as _ from '../lib/fp';

describe('function programming library', () => {
  it('map on a string returns an array of chars', () => {
    expect(_.map(x => x)('hello')).toEqual(['h', 'e', 'l', 'l', 'o']);
  });

  it('flatMap on nested arrays returns a merged array', () => {
    expect(_.flatMap(x => x)([1, [2, [3, [4, [5]]]]])).toEqual([1, 2, 3, 4, 5]);
  });

  it('range without origin start at zero', () => {
    expect(_.range(3)).toEqual([0, 1, 2]);
  });

  it('range with origin 3 start at 3', () => {
    expect(_.range(3, 5)).toEqual([3, 4, 5]);
  });

  // it('foldLeft of [] equals 0', () => {
  //   expect(_.foldLeft((acc, val) => acc * val)([])).toEqual(undefined);
  // });

  // it('foldLeft of [] with an inital value of 1 equals 1', () => {
  //   expect(_.foldLeft((acc, val) => acc * val)([], 1)).toEqual(1);
  // });

  // it('foldLeft of 2 * 5 equals 10', () => {
  //   expect(_.foldLeft((acc, val) => acc * val)([2, 5])).toEqual(10);
  // });

  it('foldRight of 2 * 5 with an inital value of 10 equals 100', () => {
    expect(_.foldRight((acc, val) => acc * val)([2, 5], 10)).toEqual(100);
  });

  it('foldRight of [] equals undefined', () => {
    expect(_.foldRight((acc, val) => acc * val)([])).toEqual(undefined);
  });

  it('foldRight of [] with an inital value of 1 equals 1', () => {
    expect(_.foldRight((acc, val) => acc * val)([], 1)).toEqual(1);
  });

  it('foldRight of 2 * 5 with an inital value of 10 equals 50', () => {
    expect(_.foldRight((acc, val) => acc * val)([2, 5], 10)).toEqual(100);
  });

  it('serialize resolve functions sequentially', () => {
    const isEvenOrOdd = _.pipeline(
      x => x % 2 === 0,
      x => (x ? 'even' : 'odd'),
    );
    expect(isEvenOrOdd(1)).toBe('odd');
    expect(isEvenOrOdd(2)).toBe('even');
  });
});
