import clonedeep from 'lodash.clonedeep';
import { PropertyMap } from './models';

const getProperty = (obj: object, key: string) => {
  return key.split('.').filter((s) => s.length > 0)
    .reduce((o: object, x: string) => o && o.hasOwnProperty(x) && o[x], obj);
};

const setProperty = (obj: object, key: string, value: object) => {
  key.split('.')
    .filter((s) => s.length > 0)
    .reduce((o: object, x: string, idx: number, src: Array<string>): object => {
      if (idx === src.length - 1) {
        const valueToSet = Array.isArray(value) ? clonedeep(value) : value;
        o[x] = valueToSet;
      }

      return o[x];
    }, obj);
};

const copyProperty = (sourceObject: object, resultObject: object, propertyPath: string) => {
  const value = getProperty(sourceObject, propertyPath);
  setProperty(resultObject, propertyPath, value);
};

const orderedJSONStringify = (sourceObject: object, map: PropertyMap): string => {
  const mapKeys = Object.keys(map);

  const resultObject = {};
  mapKeys.forEach((mk) => {
    const childKeys = map[mk];

    // Remove starting $
    const parentKey = mk.substr(1);

    const parent = getProperty(sourceObject, parentKey);

    // Set a default value for the property
    setProperty(resultObject, parentKey, Array.isArray(parent) ? parent : {});

    // Fetch value from source and set on output
    childKeys.forEach((key) => copyProperty(sourceObject, resultObject, `${parentKey}.${key}`));
  });

  return JSON.stringify(resultObject);
};

export default orderedJSONStringify;
