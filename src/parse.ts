import {OrderedParseResult, PropertyMap} from './models';

const traverseObject = <T extends object>(
  obj: T,
  map: PropertyMap,
  parentKey: string,
  separator: string
) => {
  const childKeys = Object.keys(obj);

  if (childKeys.length === 0) {
    return;
  }

  // Ignore storing keys for arrays
  if (!Array.isArray(obj)) {
    map[`${parentKey}`] = childKeys;
  }

  childKeys.forEach(childKey => {
    const value = obj[childKey];

    if (typeof value === 'object') {
      traverseObject(
        value,
        map,
        `${parentKey}${separator}${childKey}`,
        separator
      );
    }
  });
};

/**
 * Parse a JSON string and generate a map
 *
 * @param jsonString a json string
 * @param prefix a non-empty `string` that controls what the key prefix value is in the generated map. Defaults to `$`.
 * @param separator a non-empty `string` that controls what the key separator is in the generated map. Defaults to `~`.
 * @returns an object containing the parsed `object: T` and the `map: PropertyMap`
 */
const parse = <T extends object>(
  jsonString: string,
  prefix = '$',
  separator = '~'
): OrderedParseResult<T> => {
  if (prefix.length < 1) {
    throw new Error('Prefix should not be an empty string.');
  }

  if (separator.length < 1) {
    throw new Error('Separator should not be an empty string.');
  }

  const obj: T = JSON.parse(jsonString);

  const map = {};
  traverseObject(obj, map, prefix, separator);
  return {
    object: obj,
    map,
  };
};

export default parse;
