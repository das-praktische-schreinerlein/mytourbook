import {SDocSearchResult} from './sdoc-searchresult';

describe('SDocSearchResult', () => {
    it('should create an instance', () => {
        expect(new SDocSearchResult(undefined, undefined, undefined, undefined)).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const sdocSearchResult = new SDocSearchResult(undefined, 1, undefined, undefined);
        expect(sdocSearchResult.recordCount).toEqual(1);
    });
});
