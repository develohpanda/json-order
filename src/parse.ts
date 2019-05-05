import { OrderedParseResult, PropertyMap } from './models';

const traverseObject = (obj: object, map: PropertyMap, parentKey: string) => {
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
      traverseObject(value, map, `${parentKey}.${childKey}`);
    }
  });
};

const parse = (jsonString: string): OrderedParseResult => {
  const obj: object = JSON.parse(jsonString);

  const map = {};
  traverseObject(obj, map, '$');
  return {
    result: obj,
    map
  };
};

export default parse;
