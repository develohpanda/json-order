import { PropertyMap } from '../dist/models';
import stringify from '../src/stringify';
import { arrayBuilder as arr } from '../util/ArrayBuilder';
import { objectBuilder as object } from '../util/ObjectBuilder';

describe('stringify ', () => {
  const expectString = (obj: object, map: PropertyMap, str: string) =>
    expect(stringify(obj, map).replace(/\s/g, '')).toEqual(str);

  it('returns nothing for a blank JSON string',
    () => expectString(
      object().build(),
      object().build(),
      '{}'));

  it('ignores properties not found in source',
    () => expectString(
      object().build(),
      object()
        .prop('$', arr('a')).build(),
      '{}'));

  it('ignores properties not found in map',
    () => expectString(
      object()
        .prop('a', 1)
        .prop('b', 2).build(),
      object()
        .prop('$', arr('b')).build(),
      '{"b":2}'));

  it('returns first level object properties in order',
    () => expectString(
      object()
        .prop('a', 2)
        .prop('b', 1).build(),
      object()
        .prop('$', arr('b', 'a')).build(),
      '{"b":1,"a":2}'));

  it('returns first level array value in order',
    () => expectString(
      object()
        .prop('a', arr('2', 1, true)).build(),
      object()
        .prop('$', arr('a')).build(),
      '{"a":["2",1,true]}'));

  it('returns nested [array] > [object] properties in expected order',
    () => expectString(
      object()
        .prop('a',
          arr(
            1,
            object()
              .prop('c', 3)
              .prop('d', 2).build()
          ))
        .build(),
      object()
        .prop('$', arr('a'))
        .prop('$.a.1', arr('d', 'c')).build(),
      '{"a":[1,{"d":2,"c":3}]}'));

  it('ignores nested [array] > [object] properties not found in map',
    () => expectString(
      { a: [1, { b: 2, c: 3 }, 4] },
      { '$': ['a'], '$.a.1': ['c'] },
      '{"a":[1,{"c":3},4]}'));

  it('ignores nested [array] > [object] properties not found in map',
    () => expectString(
      { a: [1, { b: 2, c: 3 }, 4] },
      { $: ['a'] },
      '{"a":[1,{},4]}'));

  it('returns nested [object] > [object] properties in expected order',
    () => expectString(
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
      '{"i":7,"a":{"e":{"g":5,"f":4},"h":6,"b":{"d":4,"c":3}}}'));

  it('returns nested [object] > [array] > [object] > [array] > [object] properties in expected order',
    () => expectString(
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
      '{"i":7,"a":{"b":[8,{"d":[{"f":{"h":"h","g":true},"e":12},10],"c":9},11]}}'));
});
