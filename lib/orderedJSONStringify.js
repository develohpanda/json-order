// @flow

import clonedeep from 'lodash.clonedeep';

const getProperty = (obj, key) => {
  return key.split('.').filter(s => s.length > 0)
    .reduce((o: Object, x: string) => o && o.hasOwnProperty(x) && o[x], obj);
};

const setProperty = (obj, key, value) => {
  key.split(".")
    .filter(s => s.length > 0)
    .reduce((o, x, idx, src) => {
      if (idx === src.length - 1) {
        o[x] = Array.isArray(value) ? clonedeep(value) : value;
      }

      return o[x];
    }, obj);
};

const copyProperty = (sourceObject, resultObject, propertyPath) => {
  const value = getProperty(sourceObject, propertyPath);
  setProperty(resultObject, propertyPath, value);
};

const orderedJSONStringify = (sourceObject: Object, map: Object) => {
  const mapKeys = Object.keys(map);

  const resultObject = {};
  mapKeys.forEach(mk => {
    const childKeys = map[mk];

    // Remove starting $
    const parentKey = mk.substr(1);

    const parent = getProperty(sourceObject, parentKey);

    // Set a default value for the property
    setProperty(resultObject, parentKey, Array.isArray(parent) ? parent : {});

    // Fetch value from source and set on output
    childKeys.forEach(key => copyProperty(sourceObject, resultObject, `${parentKey}.${key}`));
  });

  return JSON.stringify(resultObject);
};

export default orderedJSONStringify;