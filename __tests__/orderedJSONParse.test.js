// @flow

import orderedJSONParse from "../lib/orderedJSONParse";
import type {OrderedParseResult} from "../lib/models";

describe("orderedJSONParse ", () => {
    it("returns nothing for a blank JSON string", () => {
        const result: OrderedParseResult = orderedJSONParse("{}");

        expect(result.result).toBe({});
    });
})