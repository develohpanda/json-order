import orderedJSONParse from "../src/orderedJSONParse";
import {OrderedParseResult} from "../src/models";

describe("orderedJSONParse ", () => {
    it("returns nothing for a blank JSON string", () => {
        const result: OrderedParseResult = orderedJSONParse("{}");

        expect(result.result).toBe({});
    });
});
