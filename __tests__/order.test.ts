import { PropertyMap } from '../dist/models';
import order from '../src/order';

describe('order()', () => {
  const expectObject = <T extends object>(obj: T, map: PropertyMap | null, res: T) =>
    expect(order(obj, map, '.')).toEqual(res);

  it('returns nothing for a blank JSON string',
    () => expectObject(
      {},
      {},
      {}));

  it('throws error if separator is an empty string', () => {
    expect(() => order({}, {}, '')).toThrowError('Separator should not be an empty string.');
  });

  it('ignores properties not found in source',
    () => expectObject(
      {},
      { $: ['a'] },
      {}));

  it('returns regular json string if map is undefined',
    () => expectObject(
      { a: '1', b: '2' },
      null,
      {a: '1', b: '2'}));

  it('ignores properties not found in map',
    () => expectObject(
      { a: '1', b: '2' },
      { $: ['b'] },
      {b: '2'}));

  it('returns first level object properties in order',
    () => expectObject(
      { a: 2, b: 1 },
      { $: ['b', 'a'] },
      {b: 1, a: 2}));

  it('returns first level array value in order',
    () => expectObject(
      { a: ['2', 1, true] },
      { $: ['a'] },
      {a: ['2', 1, true]}));

  it('returns nested [array] > [object] properties in expected order',
    () => expectObject(
      { a: [1, { c: '3', d: '2' }] },
      { '$': ['a'], '$.a.1': ['d', 'c'] },
      {a: [1, {d: '2', c: '3'}]}));

  it('ignores nested [array] > [object] properties not found in map',
    () => expectObject(
      { a: [1, { b: 2, c: 3 }, 4] },
      { '$': ['a'], '$.a.1': ['c'] },
      {a: [1, {c: 3}, 4]}));

  it('ignores nested [array] > [object] properties not found in map',
    () => expectObject(
      { a: [1, { b: 2, c: 3 }, 4] },
      { $: ['a'] },
      {a: [1, {}, 4]}));

  it('handles multi-character prefix',
    () => {
      expect(order(
        {
          a: {
            b: {
              c: 3, d: 4
            },
            e: {
              f: 4, g: 5
            },
            h: 6
          },
          i: 7
        },
        {
          'ab': ['i', 'a'],
          'ab.a': ['e', 'h', 'b'],
          'ab.a.e': ['g', 'f'],
          'ab.a.b': ['d', 'c']
        },
        '.')).toEqual({i: 7, a: {e: {g: 5, f: 4}, h: 6, b: {d: 4, c: 3}}});
    });

  it('handles multi-character separator',
    () => {
      expect(order(
        {
          a: {
            b: {
              c: 3, d: 4
            },
            e: {
              f: 4, g: 5
            },
            h: 6
          },
          i: 7
        },
        {
          '$': ['i', 'a'],
          '$~|a': ['e', 'h', 'b'],
          '$~|a~|e': ['g', 'f'],
          '$~|a~|b': ['d', 'c']
        },
        '~|')).toEqual({i: 7, a: {e: {g: 5, f: 4}, h: 6, b: {d: 4, c: 3}}});
    });

  it('returns nested [object] > [object] properties in expected order',
    () => expectObject(
      {
        a: {
          b: {
            c: 3, d: 4
          },
          e: {
            f: 4, g: 5
          },
          h: 6
        },
        i: 7
      },
      {
        '$': ['i', 'a'],
        '$.a': ['e', 'h', 'b'],
        '$.a.e': ['g', 'f'],
        '$.a.b': ['d', 'c']
      },
      {i: 7, a: {e: {g: 5, f: 4}, h: 6, b: {d: 4, c: 3}}}));

  it('returns nested [object] > [array] > [object] > [array] > [object] properties in expected order',
    () => expectObject(
      {
        a: {
          b: [8, {
            c: 9,
            d: [{
              e: 12,
              f: {
                g: true, h: 'h'
              }
            }, 10]
          }, 11]
        },
        i: 7
      },
      {
        '$': ['i', 'a'],
        '$.a': ['b'],
        '$.a.b.1': ['d', 'c'],
        '$.a.b.1.d.0': ['f', 'e'],
        '$.a.b.1.d.0.f': ['h', 'g']
      },
      {i: 7, a: {b: [8, {d: [{f: {h: 'h', g: true}, e: 12}, 10], c: 9}, 11]}}));
});
