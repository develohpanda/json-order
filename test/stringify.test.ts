import stringify from '../src/stringify';

describe('stringify ', () => {
  it('returns nothing for a blank JSON string', () => {
    const result = stringify({}, {});

    expect(result).toEqual('{}');
  });
});
