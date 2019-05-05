[![CircleCI](https://circleci.com/gh/develohpanda/json-order.svg?style=svg)](https://circleci.com/gh/develohpanda/json-order) [![GitHub tag](https://img.shields.io/github/release/develohpanda/json-order.svg)](https://GitHub.com/develohpanda/json-order/releases/) [![GitHub license](https://img.shields.io/github/license/develohpanda/json-order.svg)](https://github.com/develohpanda/json-order/blob/master/LICENSE)

# JSON ordering via lookup

This repository is an experiment in controlling the order of properties in JSON via a lookup object. It is in reference to the approach suggested for feature [1046](https://github.com/getinsomnia/insomnia/issues/1046#issuecomment-486419705) in Insomnia REST.

## Why?

JS Objects in JavaScript do keep their property insertion order (this behaviour is dependant on the JS engine), however this behaviour is not guaranteed by other systems you may interchange that object with.

For example, when storing a JS Object in a SQLite database, the returned object will be in alphabetical order.

> Note: this behavior is only for object properties. Array item order is still preserved ([ref](https://stackoverflow.com/a/7214312)).

This behavior is undesirable in certain cases. If a user has configured an application via JSON, they may choose to make logical groupings of properties. When this JSON is parsed to a JS Object, stored in the DB and extracted again, the groupings no longer exist as the properties have been alphabetically ordered.

You could choose to store the settings as a JSON string, however depending on the use case there may be difficult side-effects with existing integrations, etc.

## How it works

Start by looking at the functions `generateLookup` and `generateObject`.

Lets say your desired JSON output is:

```js
{
  "nested1": {
    "zebra": [
      5, 6, 7, {
        "fruit": "banana"
      }
    ],
    "nested2": {
      "b": 10,
      "a": true
    }
  },
  "foo": [1, 2, 3, {
    "d": "second",
    "c": "first"
  }, "test"]
}
```

On reading from SQLite, your default ordering will be alphabetical, thus:

```js
{
  "foo": [1, 2, 3, {
    "c": "first",
    "d": "second"
  }, "test"],
  "nested1": {
    "nested2": {
      "a": true,
      "b": 10
    },
    "zebra": [
      5, 6, 7, {
        "fruit": "banana"
      }
    ]
  }
}
```

The results of running through this recursive algorithm to generate a lookup and then generate the ordered JSON object are shown below. Using this, the JS Object and Lookup table can be stored in SQLite, and when required to show to the user, the JSON can be ordered correctly.

The generated lookup table looks like:

```js
{
  "$": ["nested1", "foo"],
  "$.nested1": ["zebra", "nested2"],
  "$.nested1.zebra.3": ["fruit"],
  "$.nested1.nested2": ["b", "a"],
  "$.foo.3": ["d", "c"]
}
```

```
Random order  : {"foo":[1,2,3,{"c":"first","d":"second"},"test"],"nested1":{"nested2":{"a":true,"b":10},"zebra":[5,6,7,{"fruit":"banana"}]}}
Desired order : {"nested1":{"zebra":[5,6,7,{"fruit":"banana"}],"nested2":{"b":10,"a":true}},"foo":[1,2,3,{"d":"second","c":"first"},"test"]}
Fixed order   : {"nested1":{"zebra":[5,6,7,{"fruit":"banana"}],"nested2":{"b":10,"a":true}},"foo":[1,2,3,{"d":"second","c":"first"},"test"]}
Lookup        : {"$":["nested1","foo"],"$.nested1":["zebra","nested2"],"$.nested1.zebra.3":["fruit"],"$.nested1.nested2":["b","a"],"$.foo.3":["d","c"]}
```