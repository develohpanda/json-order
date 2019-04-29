import orderedJSONParse from "../lib/orderedJSONParse";
import orderedJSONStringify from "../lib/orderedJSONStringify";

const desiredOrderString = `{
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
  }`;

const defaultOrderObject = {
    "foo": [1, 2, 3, { "c": "first", "d": "second", }, "test",],
    "nested1": {
        "nested2": {
            "a": true,
            "b": 10,
        },
        "zebra": [
            5, 6, 7, { "fruit": "banana", },
        ],
    },
};

const parsed = orderedJSONParse(desiredOrderString);
const fixedOrderString = orderedJSONStringify(defaultOrderObject, parsed.map);

console.log(`Random order  : ${JSON.stringify(defaultOrderObject)}`);
console.log(`Desired order : ${desiredOrderString.replace(/\s/g, "")}`);
console.log(`Fixed order   : ${fixedOrderString.replace(/\s/g, "")}`);
