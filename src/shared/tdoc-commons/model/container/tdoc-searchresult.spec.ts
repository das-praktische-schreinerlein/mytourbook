import {TourDocSearchResult} from './tdoc-searchresult';

describe('TourDocSearchResult', () => {
    it('should create an instance', () => {
        expect(new TourDocSearchResult(undefined, undefined, undefined, undefined)).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const tdocSearchResult = new TourDocSearchResult(undefined, 1, undefined, undefined);
        expect(tdocSearchResult.recordCount).toEqual(1);
    });
});
