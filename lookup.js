const expectedOrder = {
  "nested1": {
    "nested2": {
      "b": 10,
      "a": true
    }
  },
  "foo": [1, 2, 3, "test", { "first": "hi", "second": "there" }]
};

const unordered = {
  "foo": [1, 2, 3, "test", { "second": "there", "first": "hi" }],
  "nested1": {
    "nested2": {
      "a": true,
      "b": 10
    }
  }
};

function getKeys(obj) {
  return Object.keys(obj);
}

function nestedObj(obj) {
  return (
    typeof (obj) === "object" ? obj : undefined);
}

function traverseObject(obj, lookup, parentKey) {
  const childKeys = getKeys(obj);

  if (!Array.isArray(obj)) {
    lookup[`$${parentKey}`] = childKeys;
  }

  childKeys.forEach((childKey) => {
    const nested = nestedObj(obj[childKey]);

    if (nested) {
      traverseObject(nested, lookup, `${parentKey}.${childKey}`);
    }
  });
}

function generateLookup(obj) {
  let lookup = {};

  traverseObject(obj, lookup, "");

  console.log(JSON.stringify(lookup));
  return lookup;
}

function getProperty(obj, key) {
  return key
    .split(".")
    .filter(s => s.length > 0)
    .reduce((o, x) => o && o.hasOwnProperty(x) && o[x], obj);
}

function setProperty(obj, key, value) {
  key.split(".").filter(s => s.length > 0).reduce((o, x, idx, src) => {
    if (idx === src.length - 1) {
      o[x] = value;
    }
    return o[x];
  }, obj);
}

function generateObject(lookup, obj) {
  const lookupKeys = getKeys(lookup);

  const orderedObject = {};
  lookupKeys.forEach((lookupKey) => {
    const keys = lookup[lookupKey];
    const parentKey = lookupKey.substr(1);
    const parent = getProperty(obj, parentKey);
    setProperty(orderedObject, parentKey, Array.isArray(parent) ? parent : {});

    keys.forEach(key => {
      const value = getProperty(obj, `${parentKey}.${key}`);
      setProperty(orderedObject, `${parentKey}.${key}`, value);
    });
  });

  console.log(JSON.stringify(orderedObject));
  console.log(JSON.stringify(expectedOrder));
}

const lookup = generateLookup(expectedOrder);
const ordered = generateObject(lookup, unordered);