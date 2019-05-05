import parse from '../src/parse';

describe('parse ', () => {
  it('returns nothing for a blank JSON string', () => {
    const result = parse('{}');

    expect(result.result).toEqual({});
    expect(result.map).toEqual({});
  });
});
