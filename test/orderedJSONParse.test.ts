import { OrderedParseResult } from '../src/models';
import orderedJSONParse from '../src/orderedJSONParse';

describe('orderedJSONParse ', () => {
  it('returns nothing for a blank JSON string', () => {
    const result: OrderedParseResult = orderedJSONParse('{}');

    expect(result.result).toEqual({});
    expect(result.map).toEqual({});
  });
});
