import orderedJSON from '../src/index';
import parse from '../src/parse';
import stringify from '../src/stringify';

describe('package export', () => {
    it('parse correctly configured', () => {
        expect(orderedJSON.parse).toBe(parse);
    });

    it('stringify correctly configured', () => {
        expect(orderedJSON.stringify).toBe(stringify);
    });
});
