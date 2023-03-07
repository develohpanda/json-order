import {escapeKey, splitKey} from '../src/key';

describe('escapeKey()', () => {
  it.each([
    [
      'key does not contain a separator or slash',
      'object_property_name',
      '~',
      'object_property_name',
    ],
    [
      'key contains the separator character',
      'object~property~name',
      '~',
      'object\\~property\\~name',
    ],
    [
      'key contains the separator character, using a multi-character separator',
      'object$$property$$name',
      '$$',
      'object\\$$property\\$$name',
    ],
    [
      'key contains the escape character',
      'object\\property\\name',
      '~',
      'object\\\\property\\\\name',
    ],
  ])(
    'handles when %s',
    (description: string, key: string, separator: string, expected: string) => {
      expect(escapeKey(key, separator)).toEqual(expected);
    }
  );
});

describe('splitKey()', () => {
  it.each([
    [
      'key does not contain any escape sequences',
      'object~property~name',
      '~',
      ['object', 'property', 'name'],
    ],
    [
      'key does not contain any escape sequences, using a multi-character separator',
      'object$$property$$name',
      '$$',
      ['object', 'property', 'name'],
    ],
    [
      'key contains an escaped separator',
      'object~property\\~name',
      '~',
      ['object', 'property~name'],
    ],
    [
      'keys contains an escaped separator, using a multi-character separator',
      'object$$property\\$$name',
      '$$',
      ['object', 'property$$name'],
    ],
    [
      'it contains an escaped slash',
      'object~property\\\\name',
      '~',
      ['object', 'property\\name'],
    ],
  ])(
    'handles when %s',
    (
      description: string,
      key: string,
      separator: string,
      expected: Array<string>
    ) => {
      expect(splitKey(key, separator)).toEqual(expected);
    }
  );
});
