import clonedeep from 'lodash.clonedeep';

const getProperty = (obj, key) => {
  return key.split('.').filter(s => s.length > 0)
    .reduce((o, x) => o && o.hasOwnProperty(x) && o[x], obj);
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

const orderedJSONStringify = (obj, map) => {
  const mapKeys = Object.keys(map);

  const result = {};
  mapKeys.forEach(mk => {
    const childKeys = map[mk];
    const parentKey = mk.substr(1); // Remove starting $

    const parent = getProperty(obj, parentKey);

    // Set a default value for the property
    setProperty(result, parentKey, Array.isArray(parent) ? parent : {});

    // Fetch value from source and set on output
    childKeys.forEach(key => {
      const propertyPath = `${parentKey}.${key}`;

      const value = getProperty(obj, propertyPath);
      setProperty(result, propertyPath, value);
    });
  });

  return result;
};

export default orderedJSONStringify;