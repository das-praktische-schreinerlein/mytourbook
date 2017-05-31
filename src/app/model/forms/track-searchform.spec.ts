import {TrackSearchForm} from './track-searchform';

describe('TrackSearchForm', () => {
    it('should create an instance', () => {
        expect(new TrackSearchForm({})).toBeTruthy();
    });

    it('should accept values in the constructor', () => {
        const track = new TrackSearchForm({
            fulltext: 'hello'
        });
        expect(track.fulltext).toEqual('hello');
    });
});
