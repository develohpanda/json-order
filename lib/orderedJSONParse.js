// @flow

const traverseObject = (obj: Object, map: Object, parentKey: string) => {
    const childKeys = Object.keys(obj);

    // Ignore storing keys for arrays
    if (!Array.isArray(obj)) {
        map[`${parentKey}`] = childKeys;
    }

    childKeys.forEach(childKey => {
        const value = obj[childKey];

        if (typeof (obj) === "object") {
            traverseObject(value, map, `${parentKey}.${childKey}`);
        }
    });
};

const orderedJSONParse = (jsonString: string) => {
    const obj: Object = JSON.parse(jsonString);

    let map = {};
    traverseObject(obj, map, "");
    return { obj, map, };
};

export default orderedJSONParse;