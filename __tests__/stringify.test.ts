/* eslint-disable @typescript-eslint/ban-types */
import stringify from '../src/stringify';
import {PropertyMap} from '../src/models';

describe('stringify ', () => {
  const expectString = (obj: object, map: PropertyMap | null, space: string | number | undefined, str: string) =>
    expect(stringify(obj, map, '.', space)).toEqual(str);

  it('returns nothing for a blank JSON string', () =>
    expectString({}, {}, undefined, '{}'));

  it('throws error if separator is an empty string', () => {
    expect(() => stringify({}, {}, '')).toThrowError(
      'Separator should not be an empty string.'
    );
  });

  it('ignores properties not found in source', () =>
    expectString({}, {$: ['a']}, undefined, '{}'));

  it('returns regular json string if map is undefined', () =>
    expectString({a: '1', b: '2'}, null, undefined, '{"a":"1","b":"2"}'));

  it('ignores properties not found in map', () =>
    expectString({a: '1', b: '2'}, {$: ['b']}, undefined, '{"b":"2"}'));

  it('returns first level object properties in order', () =>
    expectString({a: 2, b: 1}, {$: ['b', 'a']}, undefined, '{"b":1,"a":2}'));

  it('returns first level array value in order', () =>
    expectString({a: ['2', 1, true]}, {$: ['a']}, undefined, '{"a":["2",1,true]}'));

  it('returns nested [array] > [object] properties in expected order', () =>
    expectString(
      {a: [1, {c: '3', d: '2'}]},
      {'$': ['a'], '$.a.1': ['d', 'c']},
      undefined,
      '{"a":[1,{"d":"2","c":"3"}]}'
    ));

  it('ignores nested [array] > [object] properties not found in map', () =>
    expectString(
      {a: [1, {b: 2, c: 3}, 4]},
      {'$': ['a'], '$.a.1': ['c']},
      undefined,
      '{"a":[1,{"c":3},4]}'
    ));

  it('ignores nested [array] > [object] properties not found in map', () =>
    expectString({a: [1, {b: 2, c: 3}, 4]}, {$: ['a']}, undefined, '{"a":[1,{},4]}'));

  it('handles multi-character prefix', () => {
    expect(
      stringify(
        {
          a: {
            b: {
              c: 3,
              d: 4,
            },
            e: {
              f: 4,
              g: 5,
            },
            h: 6,
          },
          i: 7,
        },
        {
          'ab': ['i', 'a'],
          'ab.a': ['e', 'h', 'b'],
          'ab.a.e': ['g', 'f'],
          'ab.a.b': ['d', 'c'],
        },
        '.',
        0
      )
    ).toEqual('{"i":7,"a":{"e":{"g":5,"f":4},"h":6,"b":{"d":4,"c":3}}}');
  });

  it('handles multi-character separator', () => {
    expect(
      stringify(
        {
          a: {
            b: {
              c: 3,
              d: 4,
            },
            e: {
              f: 4,
              g: 5,
            },
            h: 6,
          },
          i: 7,
        },
        {
          '$': ['i', 'a'],
          '$~|a': ['e', 'h', 'b'],
          '$~|a~|e': ['g', 'f'],
          '$~|a~|b': ['d', 'c'],
        },
        '~|',
        0
      )
    ).toEqual('{"i":7,"a":{"e":{"g":5,"f":4},"h":6,"b":{"d":4,"c":3}}}');
  });

  it('returns nested [object] > [object] properties in expected order', () =>
    expectString(
      {
        a: {
          b: {
            c: 3,
            d: 4,
          },
          e: {
            f: 4,
            g: 5,
          },
          h: 6,
        },
        i: 7,
      },
      {
        '$': ['i', 'a'],
        '$.a': ['e', 'h', 'b'],
        '$.a.e': ['g', 'f'],
        '$.a.b': ['d', 'c'],
      },
      undefined,
      '{"i":7,"a":{"e":{"g":5,"f":4},"h":6,"b":{"d":4,"c":3}}}'
    ));

  it('returns nested [object] > [array] > [object] > [array] > [object] properties in expected order', () =>
    expectString(
      {
        a: {
          b: [
            8,
            {
              c: 9,
              d: [
                {
                  e: 12,
                  f: {
                    g: true,
                    h: 'h',
                  },
                },
                10,
              ],
            },
            11,
          ],
        },
        i: 7,
      },
      {
        '$': ['i', 'a'],
        '$.a': ['b'],
        '$.a.b.1': ['d', 'c'],
        '$.a.b.1.d.0': ['f', 'e'],
        '$.a.b.1.d.0.f': ['h', 'g'],
      },
      undefined,
      '{"i":7,"a":{"b":[8,{"d":[{"f":{"h":"h","g":true},"e":12},10],"c":9},11]}}'
    ));
  
    it('supports numeric space parameter', () => {
      expectString({ a: { b: { c: 3 } } }, null, 2, '{\n  "a": {\n    "b": {\n      "c": 3\n    }\n  }\n}');
    });
  
    it('supports actual-space space parameter', () => {
      expectString({ a: { b: { c: 3 } } }, null, "  ", '{\n  "a": {\n    "b": {\n      "c": 3\n    }\n  }\n}');
    });
  
    it('supports any character space parameter', () => {
      expectString({ a: { b: { c: 3 } } }, null, ">", '{\n>"a": {\n>>"b": {\n>>>"c": 3\n>>}\n>}\n}');
    });
});
