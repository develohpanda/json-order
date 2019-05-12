import { OrderedParseResult, PropertyMap } from './models';

const traverseObject = (obj: object, map: PropertyMap, parentKey: string, separator: string) => {
  const childKeys = Object.keys(obj);

  if (childKeys.length === 0) {
    return;
  }

  // Ignore storing keys for arrays
  if (!Array.isArray(obj)) {
    map[`${parentKey}`] = childKeys;
  }

  childKeys.forEach((childKey) => {
    const value = obj[childKey];

    if (typeof (value) === 'object') {
      traverseObject(value, map, `${parentKey}${separator}${childKey}`, separator);
    }
  });
};

const parse = (jsonString: string, prefix: string = '$', separator: string = '~'): OrderedParseResult => {
  if (prefix.length < 1) {
    throw new Error('Prefix should not be an empty string.');
  }

  if (separator.length < 1) {
    throw new Error('Separator should not be an empty string.');
  }

  const obj: object = JSON.parse(jsonString);

  const map = {};
  traverseObject(obj, map, prefix, separator);
  return {
    object: obj,
    map
  };
};

export default parse;
