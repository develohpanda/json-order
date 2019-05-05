import orderedJSONParse from '../dist/orderedJSONParse';
import orderedJSONStringify from '../dist/orderedJSONStringify';
import orderedJSON from '../src/index';

describe('package export', () => {
    it('parse correctly configured', () => {
        expect(orderedJSON.parse).toBe(orderedJSONParse);
    });

    it('stringify correctly configured', () => {
        expect(orderedJSON.stringify).toBe(orderedJSONStringify);
    });
});
