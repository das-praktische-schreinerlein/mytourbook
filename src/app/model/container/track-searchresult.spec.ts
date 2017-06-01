import {TrackSearchResult} from './track-searchresult';

describe('TrackSearchResult', () => {
    it('should create an instance', () => {
        expect(new TrackSearchResult(undefined, undefined, undefined)).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const trackSearchResult = new TrackSearchResult(undefined, 1, undefined);
        expect(trackSearchResult.recordCount).toEqual(1);
    });
});
