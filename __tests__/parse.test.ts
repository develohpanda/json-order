import {PropertyMap} from '../src/models';
import parse from '../src/parse';

describe('parse ', () => {
  const expectMap = (input: string, map: PropertyMap) =>
    expect(parse(input, '$', '.').map).toEqual(map);

  it('returns nothing for a blank JSON string', () => expectMap('{}', {}));

  it('throws error if prefix is an empty string', () => {
    expect(() => parse('', '', '.')).toThrowError(
      'Prefix should not be an empty string.'
    );
  });

  it('throws error if separator is an empty string', () => {
    expect(() => parse('', '$', '')).toThrowError(
      'Separator should not be an empty string.'
    );
  });

  it('handles top level values for of primitive types', () => {
    const input = `
    {
      "b": "str",
      "c": 3,
      "a": true
    }`;

    const map = {
      $: ['b', 'c', 'a'],
    };

    expectMap(input, map);
  });

  it('handles top level values of type [object]', () => {
    const input = `
    {
      "a": {
        "az": "str",
        "ay": "str"
      }
    }`;

    const map = {
      '$': ['a'],
      '$.a': ['az', 'ay'],
    };

    expectMap(input, map);
  });

  it('handles top level values of a blank [object]', () => {
    const input = `
    {
      "a": { }
    }`;

    const map = {
      $: ['a'],
    };

    expectMap(input, map);
  });

  it('handles multi-character prefix', () => {
    const input = `
    {
      "a": {
        "a2": {
          "b": "str"
        },
        "a1": {
          "d": 2,
          "c": false
        }
      }
    }`;

    const map = {
      'ab': ['a'],
      'ab.a': ['a2', 'a1'],
      'ab.a.a2': ['b'],
      'ab.a.a1': ['d', 'c'],
    };

    expect(parse(input, 'ab', '.').map).toEqual(map);
  });

  it('handles multi-character separator', () => {
    const input = `
    {
      "a": {
        "a2": {
          "b": "str"
        },
        "a1": {
          "d": 2,
          "c": false
        }
      }
    }`;

    const map = {
      '$': ['a'],
      '$~|a': ['a2', 'a1'],
      '$~|a~|a2': ['b'],
      '$~|a~|a1': ['d', 'c'],
    };

    expect(parse(input, '$', '~|').map).toEqual(map);
  });

  it('handles nesting [object] > [object]', () => {
    const input = `
    {
      "a": {
        "a2": {
          "b": "str"
        },
        "a1": {
          "d": 2,
          "c": false
        }
      }
    }`;

    const map = {
      '$': ['a'],
      '$.a': ['a2', 'a1'],
      '$.a.a2': ['b'],
      '$.a.a1': ['d', 'c'],
    };

    expectMap(input, map);
  });

  it('should not return mappings for primitive elements of an [array]', () => {
    const input = `
    {
      "a": [1, "2", "three"]
    }`;

    const map = {
      $: ['a'],
    };

    expectMap(input, map);
  });

  it('handles nesting [array] > [array]', () => {
    const input = `
    {
      "a": [1, "two", [ 3, "four", true]]
    }`;

    const map = {
      $: ['a'],
    };

    expectMap(input, map);
  });

  it('handles nesting [array] > [object]', () => {
    const input = `
    {
      "a": [1, "two", {
        "b": "str"
      }]
    }`;

    const map = {
      '$': ['a'],
      '$.a.2': ['b'],
    };

    expectMap(input, map);
  });

  it('handles nesting [array] > [array] > [object]', () => {
    const input = `
    {
      "c": [1, "two", [3, {
        "b": "str"
      }, 4], {
        "a": "str"
      }]
    }`;

    const map = {
      '$': ['c'],
      '$.c.2.1': ['b'],
      '$.c.3': ['a'],
    };

    expectMap(input, map);
  });

  it('handles nesting [array] > [array] > [object] > [array] > [object]', () => {
    const input = `
    {
      "d": [
        1, "two", [
          3, {
            "c": "str",
            "b": [4, {
              "a": "str"
            }]
          }
        ]
      ]
    }`;

    const map = {
      '$': ['d'],
      '$.d.2.1': ['c', 'b'],
      '$.d.2.1.b.1': ['a'],
    };

    expectMap(input, map);
  });
});
