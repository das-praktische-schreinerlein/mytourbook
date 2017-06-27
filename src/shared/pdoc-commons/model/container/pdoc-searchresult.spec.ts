import {PDocSearchResult} from './pdoc-searchresult';

describe('PDocSearchResult', () => {
    it('should create an instance', () => {
        expect(new PDocSearchResult(undefined, undefined, undefined, undefined)).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const pdocSearchResult = new PDocSearchResult(undefined, 1, undefined, undefined);
        expect(pdocSearchResult.recordCount).toEqual(1);
    });
});
