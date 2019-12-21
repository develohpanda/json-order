import order from '../src/order';
import parse from '../src/parse';
import stringify from '../src/stringify';
import orderedJSON from '../src';

describe('package export', () => {
  it('parse correctly configured', () => {
    expect(orderedJSON.parse).toBe(parse);
  });

  it('stringify correctly configured', () => {
    expect(orderedJSON.stringify).toBe(stringify);
  });

  it('order correctly configured', () => {
    expect(orderedJSON.order).toBe(order);
  });
});
