const desiredOrder = {
  "nested1": {
    "zebra": [
      5, 6, 7, { "fruit": "banana" }
    ],
    "nested2": {
      "b": 10,
      "a": true
    }
  },
  "foo": [1, 2, 3, { "d": "second", "c": "first" }, "test"]
};

const defaultOrder = {
  "foo": [1, 2, 3, { "c": "first", "d": "second" }, "test"],
  "nested1": {
    "nested2": {
      "a": true,
      "b": 10
    },
    "zebra": [
      5, 6, 7, { "fruit": "banana" }
    ]
  }
};

function getKeys(obj) {
  return Object.keys(obj);
}

function isObject(obj) {
  return typeof (obj) === "object";
}

function traverseObject(obj, lookup, parentKey) {
  const childKeys = getKeys(obj);

  // Ignore storing keys for arrays (it is just an array of indexes)
  if (!Array.isArray(obj)) {
    lookup[`$${parentKey}`] = childKeys;
  }

  childKeys.forEach((childKey) => {
    const nested = obj[childKey];

    if (isObject(nested)) {
      traverseObject(nested, lookup, `${parentKey}.${childKey}`);
    }
  });
}

function generateLookup(obj) {
  let lookup = {};

  traverseObject(obj, lookup, "");

  return lookup;
}

function getProperty(obj, key) {
  return key.split(".")
    .filter(s => s.length > 0)
    .reduce((o, x) => o && o.hasOwnProperty(x) && o[x], obj);
}

function deepCloneArray(val) {
  return JSON.parse(JSON.stringify(val));
}

function setProperty(obj, key, value) {
  key.split(".")
    .filter(s => s.length > 0)
    .reduce((o, x, idx, src) => {
      if (idx === src.length - 1) {
        o[x] = Array.isArray(value) ? deepCloneArray(value) : value;
      }
      return o[x];
    }, obj);
}

function generateObject(lookup, obj) {
  const lookupKeys = getKeys(lookup);

  const orderedObject = {};
  lookupKeys.forEach((lookupKey) => {
    const keys = lookup[lookupKey];
    const parentKey = lookupKey.substr(1); // Remove starting $
    const parent = getProperty(obj, parentKey);

    // Set a default value for the property
    setProperty(orderedObject, parentKey, Array.isArray(parent) ? parent : {});

    // Fetch value from source and set on output
    keys.forEach(key => {
      const value = getProperty(obj, `${parentKey}.${key}`);
      setProperty(orderedObject, `${parentKey}.${key}`, value);
    });
  });

  return orderedObject;
}

const lookup = generateLookup(desiredOrder);
const fixedOrder = generateObject(lookup, defaultOrder);

console.log(`Random order  : ${JSON.stringify(defaultOrder)}`);
console.log(`Desired order : ${JSON.stringify(desiredOrder)}`);
console.log(`Fixed order   : ${JSON.stringify(fixedOrder)}`);
console.log(`Lookup        : ${JSON.stringify(lookup)}`);
