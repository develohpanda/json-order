import clonedeep from 'lodash.clonedeep';
import { PropertyMap } from './models';

interface GetResult {
  exists: boolean;
  value: object;
}

const getProperty = (obj: object, key: string): GetResult => {
  let exists = true;

  const value = key.split('.')
    .filter((s) => s.length > 0)
    .reduce((o: object, x: string) => {
      exists = o && o.hasOwnProperty(x);

      if (!exists) {
        return undefined;
      }

      return o[x];
    }, obj);

  return { exists, value };
};

const setProperty = (obj: object, key: string, value: object) => {
  key.split('.')
    .filter((s) => s.length > 0)
    .reduce((o: object, x: string, idx: number, src: Array<string>): object => {
      if (idx === src.length - 1) {
        const valueToSet = Array.isArray(value) ? clonedeep(value).map((p) => typeof (p) === 'object' ? {} : p) : value;
        o[x] = valueToSet;
      }

      return o[x];
    }, obj);
};

const copyProperty = (sourceObject: object, resultObject: object, propertyPath: string) => {
  const result = getProperty(sourceObject, propertyPath);
  if (result.exists) {
    setProperty(resultObject, propertyPath, result.value);
  }
};

const stringify = (sourceObject: object, map?: PropertyMap, space?: number): string => {
  if (!map) {
    return JSON.stringify(sourceObject, null, space);
  }

  const mapKeys = Object.keys(map);
  const prefixLength = mapKeys[0] && mapKeys[0].length || 0;

  const resultObject = {};
  mapKeys.forEach((mk) => {
    const childKeys = map[mk];

    // Remove starting $
    const parentKey = mk.substr(prefixLength);

    const parent = getProperty(sourceObject, parentKey);

    if (parent.exists) {
      // Set a default value for the property
      const defaultValue = Array.isArray(parent.value) ? parent.value : {};

      setProperty(resultObject, parentKey, defaultValue);

      // Fetch value from source and set on output
      childKeys.forEach((key) => copyProperty(sourceObject, resultObject, `${parentKey}.${key}`));
    }
  });

  return JSON.stringify(resultObject, null, space);
};

export default stringify;
